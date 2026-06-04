"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const global_exception_filter_1 = require("./global-exception.filter");
const common_1 = require("@nestjs/common");
describe('GlobalExceptionFilter', () => {
    let filter;
    let mockJson;
    let mockStatus;
    let mockGetResponse;
    let mockHttpArgumentsHost;
    let mockArgumentsHost;
    beforeEach(() => {
        filter = new global_exception_filter_1.GlobalExceptionFilter();
        mockJson = jest.fn();
        mockStatus = jest.fn().mockReturnValue({ json: mockJson });
        mockGetResponse = jest.fn().mockReturnValue({ status: mockStatus });
        mockHttpArgumentsHost = jest.fn().mockReturnValue({ getResponse: mockGetResponse });
        mockArgumentsHost = {
            switchToHttp: mockHttpArgumentsHost,
        };
    });
    it('should map UnauthorizedException to AUTH_001', () => {
        const exception = new common_1.UnauthorizedException('Invalid token');
        filter.catch(exception, mockArgumentsHost);
        expect(mockStatus).toHaveBeenCalledWith(common_1.HttpStatus.UNAUTHORIZED);
        expect(mockJson).toHaveBeenCalledWith({
            success: false,
            errorCode: 'AUTH_001',
            message: 'Invalid token',
            statusCode: 401,
        });
    });
    it('should map ForbiddenException to ROLE_001', () => {
        const exception = new common_1.ForbiddenException('Tenant isolation violation');
        filter.catch(exception, mockArgumentsHost);
        expect(mockStatus).toHaveBeenCalledWith(common_1.HttpStatus.FORBIDDEN);
        expect(mockJson).toHaveBeenCalledWith({
            success: false,
            errorCode: 'ROLE_001',
            message: 'Tenant isolation violation',
            statusCode: 403,
        });
    });
    it('should format ValidationPipe BadRequest array to VAL_001 string', () => {
        const exception = new common_1.BadRequestException(['email must be an email', 'password is too short']);
        filter.catch(exception, mockArgumentsHost);
        expect(mockStatus).toHaveBeenCalledWith(common_1.HttpStatus.BAD_REQUEST);
        expect(mockJson).toHaveBeenCalledWith({
            success: false,
            errorCode: 'VAL_001',
            message: 'email must be an email, password is too short',
            statusCode: 400,
        });
    });
    it('should allow custom thrown errorCodes', () => {
        const customException = new common_1.HttpException({
            message: 'Course not published',
            errorCode: 'COURSE_002',
        }, common_1.HttpStatus.FORBIDDEN);
        filter.catch(customException, mockArgumentsHost);
        expect(mockJson).toHaveBeenCalledWith({
            success: false,
            errorCode: 'COURSE_002',
            message: 'Course not published',
            statusCode: 403,
        });
    });
    it('should default to SYS_001 for unhandled errors', () => {
        const exception = new Error('Database connection failed');
        filter.catch(exception, mockArgumentsHost);
        expect(mockStatus).toHaveBeenCalledWith(common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        expect(mockJson).toHaveBeenCalledWith({
            success: false,
            errorCode: 'SYS_001',
            message: 'Internal server error',
            statusCode: 500,
        });
    });
});
//# sourceMappingURL=global-exception.filter.spec.js.map