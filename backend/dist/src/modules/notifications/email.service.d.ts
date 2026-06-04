export declare class EmailService {
    private readonly logger;
    private transporter;
    constructor();
    sendEmail(to: string, subject: string, htmlBody: string, textBody?: string): Promise<void>;
    sendWelcomeEmail(to: string, fullName: string): Promise<void>;
    sendPasswordResetEmail(to: string, resetCode: string): Promise<void>;
    sendCourseEnrollmentEmail(to: string, fullName: string, courseTitle: string): Promise<void>;
    sendCertificateEmail(to: string, fullName: string, courseTitle: string, verifyUrl: string): Promise<void>;
    sendExamReminderEmail(to: string, fullName: string, examTitle: string, scheduledAt: Date): Promise<void>;
}
