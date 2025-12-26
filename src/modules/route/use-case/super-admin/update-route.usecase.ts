import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";

import { SuperAdminRouteMapper } from "../../mappers/super-admin-route.mapper";
import { DTO_RQ_SuperAdminRoute } from "../../dtos/request/super-admin-route.dto";
import { SuperAdminRouteRepository } from "../../repositories/super-admin/super-admin-route.repository";

@Injectable()
export class SuperAdminUpdateRouteUseCase {
    constructor(private readonly repo: SuperAdminRouteRepository) { }

    async execute(id: string, data: DTO_RQ_SuperAdminRoute) {
        try {
          // 1. Lấy route hiện tại
          const route = await this.repo.findById(id);
          if (!route) {
            throw new NotFoundException('Tuyến không tồn tại.');
          }
    
          // 2. Normalize dữ liệu
          const routeName = data.route_name.trim();
          const shortName = data.short_name.trim();
          const journey = data.journey?.trim() || null;
          const note = data.note?.trim() || null;
    
          // 3. Kiểm tra trùng route_name
          const existRoute = await this.repo.findByCompanyAndRouteName(
            route.company_id,
            routeName,
          );
          if (existRoute && existRoute.id !== id) {
            throw new ConflictException('Tên tuyến đã tồn tại.');
          }

          route.route_name = routeName;
          route.route_name_e_ticket = data.route_name_e_ticket;
          route.short_name = data.short_name;
          route.journey = journey;
          route.note = note;
          route.base_price = data.base_price;
          route.e_ticket_price = data.e_ticket_price;
          route.distance = data.distance;
          route.status = data.status;
    
          const saved = await this.repo.updateRoute(route);
    
          return SuperAdminRouteMapper.toResponse(saved);
    
        } catch (error) {
          console.error(error);
    
          if (error instanceof ConflictException) throw error;
          if (error instanceof NotFoundException) throw error;
    
          throw new InternalServerErrorException(
            'Lỗi hệ thống. Vui lòng thử lại sau.',
          );
        }
      }
}