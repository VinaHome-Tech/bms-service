import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { OfficeModule } from './modules/office/office.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { RouteModule } from './modules/route_2/route.module';
import { SeatModule } from './modules/seat/seat.module';
import { ScheduleModule } from './modules/schedule/schedule.module';
import { TripModule } from './modules/trip/trip.module';
import { VehicleModule } from './modules/vehicle/vehicle.module';
import configuration from './config/configuration';
// import { PointModule } from './modules/point/point.module';
import { ConfigFareModule } from './modules/config/config_fare.module';
import { JwtModule } from '@nestjs/jwt';
import { PointModule } from './modules/point/point.module';
import { ConfigAppModule } from './modules/config/config.module';
import { RouteModule2 } from './modules/route/route.module';

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
    // RouteModule,
    SeatModule,
    // ScheduleModule,
    TripModule,
    VehicleModule,
    PointModule,
    ConfigFareModule,
    ConfigAppModule,
    RouteModule2,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
