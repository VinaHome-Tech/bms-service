import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // ============================================
    // CASE 1: NEST HTTP EXCEPTION (giữ nguyên logic bạn đang dùng)
    // ============================================
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const res = exception.getResponse() as any;

      // CASE 1.1: ValidationPipe error
      if (typeof res === 'object' && res?.errors) {
        return response.status(status).json({
          success: false,
          statusCode: status,
          message: res.message || 'Dữ liệu không hợp lệ',
          errors: res.errors,
        });
      }

      // CASE 1.2: HttpException thường
      let message = 'Lỗi hệ thống!';

      if (typeof res === 'string') {
        message = res;
      } else if (res && typeof res === 'object' && res.message) {
        if (Array.isArray(res.message)) {
          message = res.message.join(', ');
        } else {
          message = res.message;
        }
      }

      return response.status(status).json({
        success: false,
        statusCode: status,
        message,
      });
    }

    // ============================================
    // CASE 2: TYPEORM QUERY FAILED ERROR (lỗi DB)
    // ============================================
    if (exception instanceof QueryFailedError) {
      const errMsg = (exception as any).message ?? 'Lỗi database';

      // CASE 2.1: Duplicate Key (PostgreSQL / MySQL)
      if (errMsg.includes('duplicate key') || errMsg.includes('Duplicate entry')) {
        return response.status(400).json({
          success: false,
          statusCode: 400,
          message: 'Dữ liệu bị trùng (duplicate key)',
        });
      }

      // CASE 2.2: Foreign key constraint
      if (errMsg.includes('violates foreign key constraint')) {
        return response.status(400).json({
          success: false,
          statusCode: 400,
          message: 'Sai hoặc thiếu khóa ngoại',
        });
      }

      // CASE 2.3: Not null constraint
      if (errMsg.includes('null value in column')) {
        return response.status(400).json({
          success: false,
          statusCode: 400,
          message: 'Thiếu dữ liệu bắt buộc',
        });
      }

      // CASE 2.4: Các lỗi DB khác
      return response.status(400).json({
        success: false,
        statusCode: 400,
        message: errMsg,
      });
    }

    // ============================================
    // CASE 3: Business logic error (Error thuần)
    // UseCase throw new Error("Route not found")
    // ============================================
    if (exception instanceof Error) {
      return response.status(400).json({
        success: false,
        statusCode: 400,
        message: exception.message || 'Lỗi xử lý nghiệp vụ',
      });
    }

    // ============================================
    // CASE 4: UNKNOWN ERROR
    // ============================================
    console.error('UNHANDLED ERROR:', exception);

    return response.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Internal server error',
    });
  }
}
