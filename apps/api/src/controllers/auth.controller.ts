import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { hashPassword, comparePassword, generateToken } from '../utils/token';
import { sendSuccess, sendError } from '../utils/response';
import { env } from '../config/env';

export class AuthController {
  /**
   * Register a new patient with mandatory DPDP Act consent
   */
  static async registerPatient(req: Request, res: Response) {
    const {
      fullName,
      email,
      phone,
      password,
      dateOfBirth,
      gender,
      bloodGroup,
      emergencyContactName,
      emergencyContactPhone,
      dpdpConsentAccepted
    } = req.body;

    if (!dpdpConsentAccepted) {
      return sendError(
        res,
        'Explicit consent under the Digital Personal Data Protection (DPDP) Act is required for patient registration.',
        400,
        'DPDP_CONSENT_REQUIRED'
      );
    }

    // Check existing email or phone
    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone }]
      }
    });

    if (existing) {
      return sendError(res, 'An account with this email or phone number already exists', 409, 'USER_EXISTS');
    }

    const passwordHash = await hashPassword(password);

    // Generate unique UHID (e.g., AH-2026-XXXX)
    const count = await prisma.patientProfile.count();
    const uhid = `AH-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;

    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email,
          phone,
          passwordHash,
          role: 'PATIENT',
          isActive: true
        }
      });

      const patientProfile = await tx.patientProfile.create({
        data: {
          userId: newUser.id,
          uhid,
          fullName,
          dateOfBirth: new Date(dateOfBirth),
          gender,
          bloodGroup: bloodGroup || 'UNKNOWN',
          emergencyContactName,
          emergencyContactPhone
        }
      });

      // Record DPDP Consent Audit Trail
      await tx.dpdpConsent.create({
        data: {
          patientId: patientProfile.id,
          purpose: 'ACCOUNT_CREATION',
          isGranted: true,
          ipAddress: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown',
          userAgent: req.headers['user-agent'] || 'unknown',
          consentText:
            'I consent to Aarogya Multi-Specialty Hospital collecting and processing my identity and health data for clinical care and hospital services in accordance with the DPDP Act 2023.'
        }
      });

      return { ...newUser, patientProfile };
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return sendSuccess(
      res,
      'Registration successful',
      {
        token,
        user: {
          id: user.id,
          email: user.email,
          phone: user.phone,
          role: user.role,
          patientProfile: user.patientProfile
        }
      },
      201
    );
  }

  /**
   * User login (Email or Phone + Password)
   */
  static async login(req: Request, res: Response) {
    const { identifier, password } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { phone: identifier }]
      },
      include: {
        patientProfile: true,
        doctorProfile: {
          include: { department: true }
        }
      }
    });

    if (!user) {
      return sendError(res, 'Invalid email/phone or password', 401, 'INVALID_CREDENTIALS');
    }

    if (!user.isActive) {
      return sendError(res, 'Account is inactive. Please contact hospital support.', 403, 'ACCOUNT_INACTIVE');
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return sendError(res, 'Invalid email/phone or password', 401, 'INVALID_CREDENTIALS');
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return sendSuccess(res, 'Login successful', {
      token,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        role: user.role,
        patientProfile: user.patientProfile,
        doctorProfile: user.doctorProfile
      }
    });
  }

  /**
   * Get current authenticated user details
   */
  static async me(req: Request, res: Response) {
    if (!req.user) {
      return sendError(res, 'Not authenticated', 401, 'UNAUTHORIZED');
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        patientProfile: true,
        doctorProfile: {
          include: { department: true }
        }
      }
    });

    if (!user) {
      return sendError(res, 'User not found', 404, 'NOT_FOUND');
    }

    return sendSuccess(res, 'Current user retrieved', {
      id: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
      patientProfile: user.patientProfile,
      doctorProfile: user.doctorProfile
    });
  }

  /**
   * Logout user and clear httpOnly cookie
   */
  static async logout(_req: Request, res: Response) {
    res.clearCookie('token');
    return sendSuccess(res, 'Logged out successfully');
  }
}
