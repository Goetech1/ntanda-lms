import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    // Extract detailed error message from NestJS ValidationPipe payloads if present
    let finalMessage = message;
    
    // Map standard HTTP Status codes to our custom Error Codes
    let errorCode = 'SYS_001';
    
    if (status === HttpStatus.BAD_REQUEST) errorCode = 'VAL_001';
    else if (status === HttpStatus.UNAUTHORIZED) errorCode = 'AUTH_001';
    else if (status === HttpStatus.FORBIDDEN) errorCode = 'ROLE_001';
    else if (status === HttpStatus.NOT_FOUND) errorCode = 'SYS_004'; // Or domain specific like COURSE_001 handled in services
    else if (status === HttpStatus.CONFLICT) errorCode = 'SYS_009';

    if (typeof message === 'object' && message !== null) {
      if ((message as any).message) {
        finalMessage = (message as any).message;
        
        // If it's an array (ValidationPipe), join them
        if (Array.isArray(finalMessage)) {
          finalMessage = finalMessage.join(', ');
        }
      }
      
      // Allow throwing custom exceptions with our precise error codes
      if ((message as any).errorCode) {
        errorCode = (message as any).errorCode;
      }
    }

    response.status(status).json({
      success: false,
      errorCode,
      message: finalMessage,
      statusCode: status,
    });
  }
}
