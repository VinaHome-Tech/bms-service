import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { OfficeModule } from './modules/office/office.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { RouteModule } from './modules/route/route.module';
import { SeatModule } from './modules/seat/seat.module';
import { ScheduleModule } from './modules/schedule/schedule.module';
import { TripModule } from './modules/trip/trip.module';
import { VehicleModule } from './modules/vehicle/vehicle.module';
import configuration from './config/configuration';
import { PointModule } from './modules/point/point.module';
import { ConfigFareModule } from './modules/config/config_fare.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: configuration().jwt.secret,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        type: 'postgres',
        host: configuration().database.host,
        port: configuration().database.port,
        username: configuration().database.username,
        password: configuration().database.password,
        database: configuration().database.database,
        autoLoadEntities: true,
        synchronize: false,
        ssl: false,
      }),
    }),

    OfficeModule,
    RouteModule,
    SeatModule,
    ScheduleModule,
    TripModule,
    VehicleModule,
    PointModule,
    ConfigFareModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements OnModuleInit {
  constructor(private dataSource: DataSource) {}

  onModuleInit() {
    const logger = new Logger('DATABASE');
    if (this.dataSource.isInitialized) {
      logger.log('Kết nối PostgreSQL thành công!');
    } else {
      logger.error('Kết nối PostgreSQL thất bại!');
    }
  }
}
