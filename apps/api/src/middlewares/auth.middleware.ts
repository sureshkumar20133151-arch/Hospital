import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/token';
import { prisma } from '../config/prisma';
import { sendError } from '../utils/response';

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        phone: string;
        role: string;
        fullName: string;
        patientProfileId?: string;
        doctorProfileId?: string;
      };
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    let token: string | undefined;

    // 1. Check httpOnly cookie first
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    // 2. Check Authorization Bearer header
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      sendError(res, 'Authentication required. Please log in.', 401, 'UNAUTHORIZED');
      return;
    }

    const decoded = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        patientProfile: { select: { id: true, fullName: true } },
        doctorProfile: { select: { id: true, fullName: true } }
      }
    });

    if (!user || !user.isActive) {
      sendError(res, 'User session invalid or account deactivated', 401, 'UNAUTHORIZED');
      return;
    }

    req.user = {
      id: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
      fullName: user.patientProfile?.fullName || user.doctorProfile?.fullName || 'Staff Member',
      patientProfileId: user.patientProfile?.id,
      doctorProfileId: user.doctorProfile?.id
    };

    next();
  } catch (error) {
    sendError(res, 'Invalid or expired session token', 401, 'INVALID_TOKEN');
    return;
  }
}

export async function optionalAuth(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    let token: string | undefined;
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const decoded = verifyToken(token);
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        include: {
          patientProfile: { select: { id: true, fullName: true } },
          doctorProfile: { select: { id: true, fullName: true } }
        }
      });
      if (user && user.isActive) {
        req.user = {
          id: user.id,
          email: user.email,
          phone: user.phone,
          role: user.role,
          fullName: user.patientProfile?.fullName || user.doctorProfile?.fullName || 'Staff Member',
          patientProfileId: user.patientProfile?.id,
          doctorProfileId: user.doctorProfile?.id
        };
      }
    }
  } catch {
    // Graceful fallback for optional auth
  }
  next();
}
