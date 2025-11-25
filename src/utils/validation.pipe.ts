import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';

@Injectable()
export class CustomValidationPipe extends ValidationPipe {
  constructor(options?: ValidationPipeOptions) {
    super({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
      disableErrorMessages: false,
      validationError: {
        target: false,
        value: false,
      },
      ...options,
    });
  }

  override async transform(value: any, metadata: ArgumentMetadata) {
    try {
      return await super.transform(value, metadata);
    } catch (error) {
      if (error instanceof BadRequestException) {
        const res = error.getResponse() as any;

        // 👉 CHUẨN HÓA message (có thể là string hoặc array)
        const messages = Array.isArray(res.message)
          ? res.message
          : [res.message];

        throw new BadRequestException({
          success: false,
          statusCode: 400,
          message: 'Dữ liệu không hợp lệ',
          errors: messages, // luôn là array để client dễ hiểu
        });
      }

      throw error;
    }
  }
}
