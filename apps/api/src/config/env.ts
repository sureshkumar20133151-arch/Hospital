import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

// Load environment variables from .env if present
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });
dotenv.config();

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(5000),
  HOSPITAL_NAME: z.string().default('Aarogya Multi-Specialty Hospital'),
  HOSPITAL_PHONE: z.string().default('+91 80 4000 0000'),
  HOSPITAL_EMERGENCY_HOTLINE: z.string().default('1066'),
  HOSPITAL_EMAIL: z.string().default('support@aarogyahospital.example.com'),
  CLIENT_WEB_URL: z.string().default('http://localhost:3000'),
  CLIENT_ADMIN_URL: z.string().default('http://localhost:3001'),
  DATABASE_URL: z.string().default('postgresql://postgres:postgres@localhost:5432/aarogya_hospital?schema=public'),
  JWT_SECRET: z.string().min(16).default('aarogya-super-secure-jwt-secret-min-32-chars-long-key-12345'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  COOKIE_SECRET: z.string().default('aarogya-secure-cookie-secret-key-67890'),
  RAZORPAY_KEY_ID: z.string().optional().default('rzp_test_mock_key'),
  RAZORPAY_KEY_SECRET: z.string().optional().default('rzp_test_mock_secret'),
  STORAGE_PROVIDER: z.enum(['local', 's3', 'cloudinary']).default('local'),
  SMS_PROVIDER: z.enum(['mock', 'msg91', 'twilio']).default('mock'),
  EMAIL_PROVIDER: z.enum(['mock', 'resend', 'smtp']).default('mock')
});

export const env = EnvSchema.parse(process.env);
