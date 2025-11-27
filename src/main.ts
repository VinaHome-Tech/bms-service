import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import configuration from './config/configuration';
import { Logger } from '@nestjs/common';
import { CustomValidationPipe } from './utils/validation.pipe';
import { HttpExceptionFilter } from './utils/http-exception.filter';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('BMS_SERVICE');

  // 🟢 1) ĐĂNG KÝ MICROSOFT RABBITMQ ĐỂ NHẬN MESSAGE
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [configuration().rabbitmq.url],
      queue: configuration().rabbitmq.queue, // ⬅ Booking Service sẽ gửi vào queue này
      queueOptions: { durable: true },
    },
  });

  // 🟢 2) KHỞI ĐỘNG MICROSOFT ĐỂ LẮNG NGHE MESSAGE
  await app.startAllMicroservices();

  // 🟢 3) PHẦN HTTP API (KHÔNG ĐỔI)
  app.setGlobalPrefix('v2');
  app.useGlobalPipes(new CustomValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(Number(configuration().service.port));

  logger.log(`BMS Service is running on port ${configuration().service.port}`);
  logger.log(`RabbitMQ BMS queue is listening: bms_queue`);
}

bootstrap();
