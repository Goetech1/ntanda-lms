import { GlobalExceptionFilter } from './global-exception.filter';
import { ArgumentsHost, HttpException, HttpStatus, UnauthorizedException, ForbiddenException, BadRequestException } from '@nestjs/common';

describe('GlobalExceptionFilter', () => {
  let filter: GlobalExceptionFilter;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;
  let mockGetResponse: jest.Mock;
  let mockHttpArgumentsHost: jest.Mock;
  let mockArgumentsHost: ArgumentsHost;

  beforeEach(() => {
    filter = new GlobalExceptionFilter();
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockGetResponse = jest.fn().mockReturnValue({ status: mockStatus });
    mockHttpArgumentsHost = jest.fn().mockReturnValue({ getResponse: mockGetResponse });
    mockArgumentsHost = {
      switchToHttp: mockHttpArgumentsHost,
    } as unknown as ArgumentsHost;
  });

  it('should map UnauthorizedException to AUTH_001', () => {
    const exception = new UnauthorizedException('Invalid token');
    filter.catch(exception, mockArgumentsHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
    expect(mockJson).toHaveBeenCalledWith({
      success: false,
      errorCode: 'AUTH_001',
      message: 'Invalid token',
      statusCode: 401,
    });
  });

  it('should map ForbiddenException to ROLE_001', () => {
    const exception = new ForbiddenException('Tenant isolation violation');
    filter.catch(exception, mockArgumentsHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
    expect(mockJson).toHaveBeenCalledWith({
      success: false,
      errorCode: 'ROLE_001',
      message: 'Tenant isolation violation',
      statusCode: 403,
    });
  });

  it('should format ValidationPipe BadRequest array to VAL_001 string', () => {
    const exception = new BadRequestException(['email must be an email', 'password is too short']);
    filter.catch(exception, mockArgumentsHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockJson).toHaveBeenCalledWith({
      success: false,
      errorCode: 'VAL_001',
      message: 'email must be an email, password is too short',
      statusCode: 400,
    });
  });

  it('should allow custom thrown errorCodes', () => {
    const customException = new HttpException({
      message: 'Course not published',
      errorCode: 'COURSE_002',
    }, HttpStatus.FORBIDDEN);

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

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockJson).toHaveBeenCalledWith({
      success: false,
      errorCode: 'SYS_001',
      message: 'Internal server error',
      statusCode: 500,
    });
  });
});
