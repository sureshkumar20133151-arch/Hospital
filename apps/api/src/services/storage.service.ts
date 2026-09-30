import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export class StorageService {
  /**
   * Generates a time-limited signed URL or secure token for access-controlled files.
   * Ensures reports/prescriptions are NEVER publicly accessible.
   */
  static generateSecureReportUrl(reportId: string, patientId: string): string {
    // Generate a short-lived token valid for 15 minutes
    const accessToken = jwt.sign(
      {
        reportId,
        patientId,
        purpose: 'SECURE_PATIENT_RECORD_VIEW'
      },
      env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    // Return the authorized API stream endpoint
    return `/api/v1/records/reports/${reportId}/stream?token=${accessToken}`;
  }

  /**
   * Verifies the report access token
   */
  static verifyReportAccessToken(token: string): { reportId: string; patientId: string } | null {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as any;
      if (decoded.purpose !== 'SECURE_PATIENT_RECORD_VIEW') {
        return null;
      }
      return { reportId: decoded.reportId, patientId: decoded.patientId };
    } catch {
      return null;
    }
  }
}
