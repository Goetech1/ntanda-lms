import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      },
    });
  }

  async sendEmail(to: string, subject: string, htmlBody: string, textBody?: string): Promise<void> {
    if (!process.env.SMTP_USER) {
      this.logger.warn(`[MOCK EMAIL] To: ${to} | Subject: ${subject}`);
      this.logger.debug(`[MOCK EMAIL] Body: ${textBody || htmlBody}`);
      return;
    }

    try {
      await this.transporter.sendMail({
        from: `"Ntanda LMS" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html: htmlBody,
        text: textBody,
      });
      this.logger.log(`Email sent to ${to}: ${subject}`);
    } catch (err) {
      this.logger.error(`Failed to send email to ${to}: ${err.message}`);
      throw err;
    }
  }

  async sendWelcomeEmail(to: string, fullName: string): Promise<void> {
    await this.sendEmail(
      to,
      'Welcome to Ntanda LMS!',
      `<h2>Hello ${fullName}!</h2><p>Welcome to Ntanda LMS. Your account has been successfully created.</p>`,
      `Hello ${fullName}! Welcome to Ntanda LMS.`,
    );
  }

  async sendPasswordResetEmail(to: string, resetCode: string): Promise<void> {
    await this.sendEmail(
      to,
      'Password Reset Request',
      `<h2>Password Reset</h2><p>Your reset code is: <strong>${resetCode}</strong></p><p>This code expires in 30 minutes.</p>`,
      `Your password reset code is: ${resetCode}. Expires in 30 minutes.`,
    );
  }

  async sendCourseEnrollmentEmail(to: string, fullName: string, courseTitle: string): Promise<void> {
    await this.sendEmail(
      to,
      `You're enrolled: ${courseTitle}`,
      `<h2>Enrollment Confirmed</h2><p>Hi ${fullName}, you are now enrolled in <strong>${courseTitle}</strong>. Start learning today!</p>`,
      `Hi ${fullName}, you are now enrolled in ${courseTitle}.`,
    );
  }

  async sendCertificateEmail(to: string, fullName: string, courseTitle: string, verifyUrl: string): Promise<void> {
    await this.sendEmail(
      to,
      `Certificate Earned: ${courseTitle}`,
      `<h2>Congratulations ${fullName}!</h2><p>You have completed <strong>${courseTitle}</strong> and earned a certificate.</p><p><a href="${verifyUrl}">View Certificate</a></p>`,
      `Congratulations ${fullName}! You completed ${courseTitle}. View certificate: ${verifyUrl}`,
    );
  }

  async sendExamReminderEmail(to: string, fullName: string, examTitle: string, scheduledAt: Date): Promise<void> {
    const timeStr = scheduledAt.toUTCString();
    await this.sendEmail(
      to,
      `Exam Reminder: ${examTitle}`,
      `<h2>Upcoming Exam</h2><p>Hi ${fullName}, your exam <strong>${examTitle}</strong> is scheduled for ${timeStr}.</p>`,
      `Hi ${fullName}, your exam ${examTitle} is scheduled for ${timeStr}.`,
    );
  }
}
