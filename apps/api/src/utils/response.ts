import { Response } from 'express';

export function sendSuccess<T>(res: Response, message: string, data?: T, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
}

export function sendError(
  res: Response,
  message: string,
  statusCode = 400,
  errorCode = 'BAD_REQUEST',
  details?: any
) {
  return res.status(statusCode).json({
    success: false,
    message,
    error: {
      code: errorCode,
      details
    },
    timestamp: new Date().toISOString()
  });
}
