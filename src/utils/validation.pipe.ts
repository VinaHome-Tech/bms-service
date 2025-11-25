/* eslint-disable @typescript-eslint/no-unsafe-return */
// utils/validation.pipe.ts
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
        const response = error.getResponse();
        console.error('Validation Error:', JSON.stringify(response, null, 2));
        throw new BadRequestException({
          success: false,
          message: 'Dữ liệu không hợp lệ',
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          errors: response['message'],
        });
      }
      throw error;
    }
  }
}
