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
var SmsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsService = void 0;
const common_1 = require("@nestjs/common");
const Twilio = require('twilio');
let SmsService = SmsService_1 = class SmsService {
    constructor() {
        this.logger = new common_1.Logger(SmsService_1.name);
        this.client = null;
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        if (accountSid && authToken) {
            this.client = Twilio(accountSid, authToken);
            this.logger.log('Twilio SMS client initialized');
        }
        else {
            this.logger.warn('Twilio credentials not set. SMS will be logged (mock mode).');
        }
    }
    async sendSms(to, body) {
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
        }
        catch (err) {
            this.logger.error(`Failed to send SMS to ${to}: ${err.message}`);
            throw err;
        }
    }
    async sendOtp(to, otp) {
        await this.sendSms(to, `Your Ntanda LMS OTP is: ${otp}. Valid for 10 minutes.`);
    }
    async sendEnrollmentSms(to, courseTitle) {
        await this.sendSms(to, `You are now enrolled in "${courseTitle}" on Ntanda LMS. Start learning today!`);
    }
    async sendExamReminderSms(to, examTitle, scheduledAt) {
        await this.sendSms(to, `Reminder: Your exam "${examTitle}" starts at ${scheduledAt.toUTCString()} on Ntanda LMS.`);
    }
    async sendCertificateSms(to, courseTitle) {
        await this.sendSms(to, `Congratulations! You earned a certificate for completing "${courseTitle}" on Ntanda LMS.`);
    }
};
exports.SmsService = SmsService;
exports.SmsService = SmsService = SmsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], SmsService);
//# sourceMappingURL=sms.service.js.map