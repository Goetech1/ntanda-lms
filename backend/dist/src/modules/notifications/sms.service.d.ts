export declare class SmsService {
    private readonly logger;
    private client;
    constructor();
    sendSms(to: string, body: string): Promise<void>;
    sendOtp(to: string, otp: string): Promise<void>;
    sendEnrollmentSms(to: string, courseTitle: string): Promise<void>;
    sendExamReminderSms(to: string, examTitle: string, scheduledAt: Date): Promise<void>;
    sendCertificateSms(to: string, courseTitle: string): Promise<void>;
}
