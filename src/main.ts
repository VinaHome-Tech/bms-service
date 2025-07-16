import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { HttpExceptionFilter } from './utils/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.NATS,
      options: {
        servers: process.env.NATS_SERVER ? [process.env.NATS_SERVER] : [],
      },
    },
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen();
  console.log('✅ BMS Service is running');
}
bootstrap();
