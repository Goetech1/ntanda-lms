"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = require("nodemailer");
let EmailService = EmailService_1 = class EmailService {
    constructor() {
        this.logger = new common_1.Logger(EmailService_1.name);
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
    async sendEmail(to, subject, htmlBody, textBody) {
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
        }
        catch (err) {
            this.logger.error(`Failed to send email to ${to}: ${err.message}`);
            throw err;
        }
    }
    async sendWelcomeEmail(to, fullName) {
        await this.sendEmail(to, 'Welcome to Ntanda LMS!', `<h2>Hello ${fullName}!</h2><p>Welcome to Ntanda LMS. Your account has been successfully created.</p>`, `Hello ${fullName}! Welcome to Ntanda LMS.`);
    }
    async sendPasswordResetEmail(to, resetCode) {
        await this.sendEmail(to, 'Password Reset Request', `<h2>Password Reset</h2><p>Your reset code is: <strong>${resetCode}</strong></p><p>This code expires in 30 minutes.</p>`, `Your password reset code is: ${resetCode}. Expires in 30 minutes.`);
    }
    async sendCourseEnrollmentEmail(to, fullName, courseTitle) {
        await this.sendEmail(to, `You're enrolled: ${courseTitle}`, `<h2>Enrollment Confirmed</h2><p>Hi ${fullName}, you are now enrolled in <strong>${courseTitle}</strong>. Start learning today!</p>`, `Hi ${fullName}, you are now enrolled in ${courseTitle}.`);
    }
    async sendCertificateEmail(to, fullName, courseTitle, verifyUrl) {
        await this.sendEmail(to, `Certificate Earned: ${courseTitle}`, `<h2>Congratulations ${fullName}!</h2><p>You have completed <strong>${courseTitle}</strong> and earned a certificate.</p><p><a href="${verifyUrl}">View Certificate</a></p>`, `Congratulations ${fullName}! You completed ${courseTitle}. View certificate: ${verifyUrl}`);
    }
    async sendExamReminderEmail(to, fullName, examTitle, scheduledAt) {
        const timeStr = scheduledAt.toUTCString();
        await this.sendEmail(to, `Exam Reminder: ${examTitle}`, `<h2>Upcoming Exam</h2><p>Hi ${fullName}, your exam <strong>${examTitle}</strong> is scheduled for ${timeStr}.</p>`, `Hi ${fullName}, your exam ${examTitle} is scheduled for ${timeStr}.`);
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EmailService);
//# sourceMappingURL=email.service.js.map