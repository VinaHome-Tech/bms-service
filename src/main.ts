import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { HttpExceptionFilter } from './utils/http-exception.filter';
import configuration from './config/configuration';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.NATS,
      options: {
        servers: configuration().nats.url,
        reconnect: true,
        maxReconnectAttempts: -1,
        reconnectTimeWait: 5000,
      },
    },
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen();
  console.log('✅ BMS Service is running');
  console.log('Port: ', configuration().connect.port);
  console.log('Host: ', configuration().connect.host);
  console.log('NATS Server: ', configuration().nats.url);
}
bootstrap();
