import { Module } from '@nestjs/common';
import { RouteController } from './route.controller';
import { RouteService } from './route.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlatformRouteController } from './platform_route.controller';
import { PlatformRouteService } from './platform_route.service';
import { RoutePoint } from 'src/entities/route_point.entity';
import { Route } from 'src/entities/route.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Route, RoutePoint])],
  controllers: [RouteController, PlatformRouteController],
  providers: [RouteService, PlatformRouteService],
})
export class RouteModule {}
