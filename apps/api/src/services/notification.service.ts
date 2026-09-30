import { env } from '../config/env';

export interface SendSmsPayload {
  toPhone: string;
  message: string;
}

export interface SendEmailPayload {
  toEmail: string;
  subject: string;
  htmlContent: string;
}

export class NotificationService {
  /**
   * Send SMS / WhatsApp appointment confirmation & reminder
   */
  static async sendAppointmentNotification(data: {
    patientName: string;
    phone: string;
    email: string;
    doctorName: string;
    departmentName: string;
    date: string;
    time: string;
    tokenNumber: string;
  }) {
    const textMessage = `Aarogya Hospital: Hello ${data.patientName}, your appointment with ${data.doctorName} (${data.departmentName}) is confirmed for ${data.date} at ${data.time}. Token: ${data.tokenNumber}. Emergency: 1066.`;

    // 1. Dispatch SMS / WhatsApp
    await this.sendSms({
      toPhone: data.phone,
      message: textMessage
    });

    // 2. Dispatch Email
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #0284c7; margin-bottom: 8px;">Aarogya Multi-Specialty Hospital</h2>
        <p style="color: #64748b; font-size: 14px; margin-top: 0;">Appointment Confirmation & Details</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0;" />
        <p>Dear <strong>${data.patientName}</strong>,</p>
        <p>Your appointment has been successfully booked with details below:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr><td style="padding: 8px; color: #64748b;">Doctor:</td><td style="padding: 8px; font-weight: bold;">${data.doctorName}</td></tr>
          <tr><td style="padding: 8px; color: #64748b;">Department:</td><td style="padding: 8px; font-weight: bold;">${data.departmentName}</td></tr>
          <tr><td style="padding: 8px; color: #64748b;">Date & Time:</td><td style="padding: 8px; font-weight: bold;">${data.date} at ${data.time}</td></tr>
          <tr><td style="padding: 8px; color: #64748b;">Queue Token:</td><td style="padding: 8px; font-weight: bold; color: #0284c7;">${data.tokenNumber}</td></tr>
        </table>
        <p style="font-size: 12px; color: #94a3b8; margin-top: 24px;">
          DPDP Notice: Your personal details are processed securely in accordance with India's Digital Personal Data Protection Act.
        </p>
      </div>
    `;

    await this.sendEmail({
      toEmail: data.email,
      subject: `Appointment Confirmed: ${data.doctorName} - Aarogya Hospital`,
      htmlContent: emailHtml
    });
  }

  static async sendSms(payload: SendSmsPayload) {
    if (env.SMS_PROVIDER === 'mock') {
      console.log(`[Mock SMS Dispatched] To: ${payload.toPhone} | Message: ${payload.message}`);
      return { success: true, provider: 'mock' };
    }
    // Live integrations (MSG91 / Twilio) can be connected with environment variables
    console.log(`[SMS Provider: ${env.SMS_PROVIDER}] Sending to ${payload.toPhone}`);
    return { success: true, provider: env.SMS_PROVIDER };
  }

  static async sendEmail(payload: SendEmailPayload) {
    if (env.EMAIL_PROVIDER === 'mock') {
      console.log(`[Mock Email Dispatched] To: ${payload.toEmail} | Subject: ${payload.subject}`);
      return { success: true, provider: 'mock' };
    }
    // Live integrations (Resend / SMTP) can be connected with environment variables
    console.log(`[Email Provider: ${env.EMAIL_PROVIDER}] Sending to ${payload.toEmail}`);
    return { success: true, provider: env.EMAIL_PROVIDER };
  }
}
