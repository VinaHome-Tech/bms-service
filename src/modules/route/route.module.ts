import { Module } from '@nestjs/common';
import { BmsRouteController } from './bms_route.controller';
import { BmsRouteService } from './bms_route.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlatformRouteController } from './platform_route.controller';
import { PlatformRouteService } from './platform_route.service';
// import { RoutePoint } from 'src/entities/route_point.entity';
import { Route } from 'src/entities/route.entity';
import { ConfigFare } from 'src/entities/config-fare.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Route, ConfigFare])],
  controllers: [BmsRouteController, PlatformRouteController],
  providers: [BmsRouteService, PlatformRouteService],
  exports: [TypeOrmModule],
})
export class RouteModule {}
