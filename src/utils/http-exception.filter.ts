import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();
    const res = exception.getResponse();

    let message = 'Lỗi hệ thống!';
    if (typeof res === 'string') {
      message = res;
    } else if (typeof res === 'object' && res !== null && 'message' in res) {
      message = (res as any).message;
      if (Array.isArray(message)) {
        message = message.join(', ');
      }
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
    });
  }
}
