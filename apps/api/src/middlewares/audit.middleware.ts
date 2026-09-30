import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';

export interface AuditLogOptions {
  action: string;
  resourceType: 'LabReport' | 'MedicalRecord' | 'Prescription' | 'PatientProfile' | 'Bill';
  extractResourceId?: (req: Request) => string | undefined;
  extractPatientId?: (req: Request) => string | undefined;
}

export function auditAccess(options: AuditLogOptions) {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Continue with the request, then log asynchronously
    res.on('finish', async () => {
      // Only log on successful responses (2xx or 3xx)
      if (res.statusCode >= 200 && res.statusCode < 400) {
        try {
          const actorUserId = req.user?.id;
          const resourceId = options.extractResourceId ? options.extractResourceId(req) : (req.params.id || req.params.reportId);
          const targetPatientId = options.extractPatientId ? options.extractPatientId(req) : (req.params.patientId || req.user?.patientProfileId);

          const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
          const userAgent = req.headers['user-agent'] || 'unknown';

          await prisma.auditLog.create({
            data: {
              actorUserId: actorUserId || null,
              targetPatientId: targetPatientId || null,
              action: options.action,
              resourceType: options.resourceType,
              resourceId: resourceId || null,
              ipAddress: ipAddress.toString().substring(0, 45),
              userAgent: userAgent.substring(0, 255),
              details: {
                method: req.method,
                url: req.originalUrl,
                status: res.statusCode
              }
            }
          });
        } catch (error) {
          console.error('[DPDP Audit Log Error]', error);
        }
      }
    });

    next();
  };
}
