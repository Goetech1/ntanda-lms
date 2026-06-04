import { Injectable, Logger } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const Twilio = require('twilio');

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private client: any = null;

  constructor() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    if (accountSid && authToken) {
      this.client = Twilio(accountSid, authToken);
      this.logger.log('Twilio SMS client initialized');
    } else {
      this.logger.warn('Twilio credentials not set. SMS will be logged (mock mode).');
    }
  }

  async sendSms(to: string, body: string): Promise<void> {
    if (!this.client) {
      this.logger.warn(`[MOCK SMS] To: ${to} | Message: ${body}`);
      return;
    }

    try {
      const message = await this.client.messages.create({
        body,
        from: process.env.TWILIO_PHONE_NUMBER || '',
        to,
      });
      this.logger.log(`SMS sent to ${to}: SID ${message.sid}`);
    } catch (err) {
      this.logger.error(`Failed to send SMS to ${to}: ${err.message}`);
      throw err;
    }
  }

  async sendOtp(to: string, otp: string): Promise<void> {
    await this.sendSms(to, `Your Ntanda LMS OTP is: ${otp}. Valid for 10 minutes.`);
  }

  async sendEnrollmentSms(to: string, courseTitle: string): Promise<void> {
    await this.sendSms(to, `You are now enrolled in "${courseTitle}" on Ntanda LMS. Start learning today!`);
  }

  async sendExamReminderSms(to: string, examTitle: string, scheduledAt: Date): Promise<void> {
    await this.sendSms(to, `Reminder: Your exam "${examTitle}" starts at ${scheduledAt.toUTCString()} on Ntanda LMS.`);
  }

  async sendCertificateSms(to: string, courseTitle: string): Promise<void> {
    await this.sendSms(to, `Congratulations! You earned a certificate for completing "${courseTitle}" on Ntanda LMS.`);
  }
}
