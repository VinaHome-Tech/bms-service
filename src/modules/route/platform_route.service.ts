import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  DTO_RP_RouteItem,
  DTO_RP_RoutePoint,
  DTO_RQ_RoutePoint,
} from './route.dto';
// import { RoutePoint } from 'src/entities/route_point.entity';
import { Route } from 'src/entities/route.entity';

@Injectable()
export class PlatformRouteService {
  constructor(
    @InjectRepository(Route)
    private readonly routeRepository: Repository<Route>,

    // @InjectRepository(RoutePoint)
    // private readonly routePointRepository: Repository<RoutePoint>,
  ) {}

  // async updateRoutePoints(
  //   route_id: number,
  //   data_update: DTO_RQ_RoutePoint,
  // ): Promise<DTO_RP_RoutePoint[]> {
  //   try {
  //     console.log(route_id, data_update);
  //     const route = await this.routeRepository.findOne({
  //       where: { id: route_id },
  //       select: ['id'],
  //     });
  //     if (!route) {
  //       throw new NotFoundException('Dữ liệu tuyến không tồn tại');
  //     }
  //     await this.routePointRepository.delete({ route_id });
  //     const newRoutePoints = data_update.point_ids.map((pointId) => ({
  //       route_id,
  //       point_id: pointId,
  //     }));
  //     const savedPoints = await this.routePointRepository.save(newRoutePoints);
  //     return savedPoints.map((rp) => ({
  //       id: rp.id,
  //       route_id: rp.route_id,
  //       point_id: rp.point_id,
  //     }));
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // async getListRouteByCompany(companyId: string): Promise<DTO_RP_RouteItem[]> {
  //   try {
  //     console.log('Fetching routes for company ID:', companyId);
  //     const routes = await this.routeRepository.find({
  //       where: { company_id: companyId },
  //       select: ['id', 'route_name', 'status'],
  //       order: { display_order: 'ASC' },
  //     });
  //     if (!routes.length) {
  //       return [];
  //     }
  //     return routes.map((route) => ({
  //       id: route.id,
  //       route_name: route.route_name,
  //       status: route.status,
  //     }));
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // async getRoutePoints(route_id: number): Promise<DTO_RP_RoutePoint[]> {
  //   try {
  //     console.log('Fetching route points for route ID:', route_id);
  //     const route = await this.routeRepository.findOne({
  //       where: { id: route_id },
  //       select: ['id'],
  //     });
  //     if (!route) {
  //       throw new NotFoundException('Dữ liệu tuyến không tồn tại');
  //     }
  //     const routePoints = await this.routePointRepository.find({
  //       where: { route_id },
  //       select: ['id', 'route_id', 'point_id'],
  //       order: { id: 'ASC' },
  //     });
  //     return routePoints.map((rp) => ({
  //       id: rp.id,
  //       route_id: rp.route_id,
  //       point_id: rp.point_id,
  //     }));
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}
