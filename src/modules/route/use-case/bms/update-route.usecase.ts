import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { RouteRepository } from "../../repositories/route.repository";
import { DTO_RQ_Route } from "../../dtos/request/bms/route.dto";
import { RouteMapper } from "../../mappers/bms/route.mapper";

@Injectable()
export class UpdateRouteUseCase {
    constructor(private readonly repo: RouteRepository) { }

    async execute(id: string, data: DTO_RQ_Route) {
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
      const routeNameETicket = data.route_name_e_ticket?.trim() || null;

      // 3. Kiểm tra trùng route_name
      const existRoute = await this.repo.findByCompanyAndRouteName(
        route.company_id,
        routeName,
      );
      if (existRoute && existRoute.id !== id) {
        throw new ConflictException('Tên tuyến đã tồn tại.');
      }

      // 4. Kiểm tra trùng short_name
      const existShort = await this.repo.findByCompanyAndShortName(
        route.company_id,
        shortName,
      );
      if (existShort && existShort.id !== id) {
        throw new ConflictException('Tên tuyến rút gọn đã tồn tại.');
      }

      // 5. Kiểm tra trùng route_name_e_ticket
      if (routeNameETicket) {
        const existET = await this.repo.findByCompanyAndETicketName(
          route.company_id,
          routeNameETicket,
        );
        if (existET && existET.id !== id) {
          throw new ConflictException('Tên tuyến điện tử đã tồn tại.');
        }
      }

      // 6. Gán dữ liệu
      route.route_name = routeName;
      route.route_name_e_ticket = routeNameETicket;
      route.short_name = shortName;
      route.journey = journey;
      route.note = note;
      route.base_price = data.base_price;
      route.e_ticket_price = data.e_ticket_price;
      route.distance = data.distance;
      route.status = data.status;

      // 7. Lưu DB
      const saved = await this.repo.updateRoute(route);

      // 8. Trả về DTO
      return RouteMapper.toResponse(saved);

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