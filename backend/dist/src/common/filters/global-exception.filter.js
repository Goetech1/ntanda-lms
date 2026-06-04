"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
let GlobalExceptionFilter = class GlobalExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const status = exception instanceof common_1.HttpException
            ? exception.getStatus()
            : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        const message = exception instanceof common_1.HttpException
            ? exception.getResponse()
            : 'Internal server error';
        let finalMessage = message;
        let errorCode = 'SYS_001';
        if (status === common_1.HttpStatus.BAD_REQUEST)
            errorCode = 'VAL_001';
        else if (status === common_1.HttpStatus.UNAUTHORIZED)
            errorCode = 'AUTH_001';
        else if (status === common_1.HttpStatus.FORBIDDEN)
            errorCode = 'ROLE_001';
        else if (status === common_1.HttpStatus.NOT_FOUND)
            errorCode = 'SYS_004';
        else if (status === common_1.HttpStatus.CONFLICT)
            errorCode = 'SYS_009';
        if (typeof message === 'object' && message !== null) {
            if (message.message) {
                finalMessage = message.message;
                if (Array.isArray(finalMessage)) {
                    finalMessage = finalMessage.join(', ');
                }
            }
            if (message.errorCode) {
                errorCode = message.errorCode;
            }
        }
        response.status(status).json({
            success: false,
            errorCode,
            message: finalMessage,
            statusCode: status,
        });
    }
};
exports.GlobalExceptionFilter = GlobalExceptionFilter;
exports.GlobalExceptionFilter = GlobalExceptionFilter = __decorate([
    (0, common_1.Catch)()
], GlobalExceptionFilter);
//# sourceMappingURL=global-exception.filter.js.map