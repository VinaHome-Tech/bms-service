import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import configuration from './config/configuration';
import { Logger } from '@nestjs/common';
import { CustomValidationPipe } from './utils/validation.pipe';
import { HttpExceptionFilter } from './utils/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('BMS_SERVICE');
  // Cấu hình CORS
  // app.enableCors({
  //   origin: ['http://localhost:3000'],
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  //   credentials: false,
  //   allowedHeaders: 'Content-Type, Authorization',
  // });
  app.setGlobalPrefix('v1');
  app.useGlobalPipes(new CustomValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(Number(configuration().service.port));
  logger.log(
    `BMS Service is running on port ${configuration().service.port}`,
  );
}
bootstrap();
