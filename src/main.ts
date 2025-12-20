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

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [configuration().rabbitmq.url],
      queue: configuration().rabbitmq.queue,
      queueOptions: { durable: true },
    },
  });

  await app.startAllMicroservices();

  app.setGlobalPrefix('v2');
  app.useGlobalPipes(new CustomValidationPipe());
  // app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(Number(configuration().service.port));

  logger.log(`BMS Service is running on port ${configuration().service.port}`);
  logger.log(`RabbitMQ BMS queue is listening: bms_queue`);
}

bootstrap();
