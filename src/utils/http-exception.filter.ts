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
    const res = exception.getResponse() as any;

    // -------------------------------------------
    // CASE 1: Nếu là lỗi do ValidationPipe
    // thì res sẽ có dạng object chứa "errors"
    // => GIỮ NGUYÊN, KHÔNG ĐỤNG TỚI
    // -------------------------------------------
    if (typeof res === 'object' && res?.errors) {
      return response.status(status).json({
        success: false,
        statusCode: status,
        message: res.message || 'Dữ liệu không hợp lệ',
        errors: res.errors, // ⭐ GIỮ NGUYÊN MẢNG LỖI
      });
    }

    // -------------------------------------------
    // CASE 2: Nếu lỗi là dạng HttpException bình thường
    // (ví dụ throw new ForbiddenException("Không có quyền"))
    // => xử lý message như cũ
    // -------------------------------------------
    let message = 'Lỗi hệ thống!';
    
    if (typeof res === 'string') {
      message = res;
    } else if (res && typeof res === 'object' && 'message' in res) {
      const msg = res.message;
      if (Array.isArray(msg)) {
        message = msg.join(', ');
      } else {
        message = msg;
      }
    }

    return response.status(status).json({
      success: false,
      statusCode: status,
      message,
    });
  }
}
