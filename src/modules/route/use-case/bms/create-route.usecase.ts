import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { RouteRepository } from "../../repositories/route.repository";
import { DTO_RQ_Route } from "../../dtos/request/bms/route.dto";
import { RouteMapper } from "../../mappers/bms/route.mapper";

@Injectable()
export class CreateRouteUseCase {
    constructor(private readonly repo: RouteRepository) { }

    async execute(companyId: string, data: Partial<DTO_RQ_Route>) {
        try {
            // ==========================
            // 1. Normalize dữ liệu input
            // ==========================
            const routeName = data.route_name.trim();
            const shortName = data.short_name.trim();
            const journey = data.journey?.trim() || null;
            const note = data.note?.trim() || null;
            const routeNameETicket = data.route_name_e_ticket?.trim() || null;

            // ==========================
            // 2. Kiểm tra route_name trùng
            // ==========================
            const existRoute = await this.repo.findOneByCompanyAndRouteName(
                companyId,
                routeName,
            );

            if (existRoute) {
                throw new ConflictException('Tên tuyến đã tồn tại.');
            }

            // ==========================
            // 3. Kiểm tra short_name trùng
            // ==========================
            const existShort = await this.repo.findOneByCompanyAndShortName(
                companyId,
                shortName,
            );
            if (existShort) {
                throw new ConflictException('Tên tuyến rút gọn đã tồn tại.');
            }

            // ==========================
            // 4. Kiểm tra route_name_e_ticket trùng
            // ==========================
            if (routeNameETicket) {
                const existET = await this.repo.findOneByCompanyAndETicketName(
                    companyId,
                    routeNameETicket,
                );
                if (existET) {
                    throw new ConflictException('Tên tuyến điện tử đã tồn tại.');
                }
            }

            // ==========================
            // 5. Lấy display_order hiện tại
            // ==========================
            const maxOrder = await this.repo.getMaxDisplayOrder(companyId);
            const displayOrder = (maxOrder ?? 0) + 1;

            // ==========================
            // 6. Tạo Route mới
            // ==========================
            const created = await this.repo.createRoute(companyId, {
                base_price: data.base_price,
                distance: data.distance,
                e_ticket_price: data.e_ticket_price,
                journey,
                note,
                route_name: routeName,
                route_name_e_ticket: routeNameETicket,
                short_name: shortName,
                status: data.status,
                display_order: displayOrder,
            });
            // ==========================
            // 7. Trả về DTO response
            // ==========================
            return RouteMapper.toResponse(created);
        } catch (error) {
            console.error(error);

            if (error instanceof ConflictException) throw error;
            if (error instanceof BadRequestException) throw error;
            if (error instanceof InternalServerErrorException) throw error;

            throw new InternalServerErrorException(
                'Lỗi hệ thống. Vui lòng thử lại sau.',
            );
        }
    }
}