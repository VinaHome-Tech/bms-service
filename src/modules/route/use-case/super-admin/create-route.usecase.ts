import { ConflictException, Injectable } from "@nestjs/common";
import { SuperAdminRouteRepository } from "../../repositories/super-admin-route.repository";
import { DTO_RQ_SuperAdminRoute } from "../../dtos/request/super-admin-route.dto";
import { SuperAdminRouteMapper } from "../../mappers/super-admin-route.mapper";

@Injectable()
export class SuperAdminCreateRouteUseCase {
    constructor(private readonly superAdminRouteRepository: SuperAdminRouteRepository) { }

    async execute(companyId: string, data: DTO_RQ_SuperAdminRoute) {

        const routeName = data.route_name.trim();
        const shortName = data.short_name.trim();
        const journey = data.journey?.trim() || null;
        const note = data.note?.trim() || null;
        const routeNameETicket = data.route_name_e_ticket?.trim() || null;

        const existRoute = await this.superAdminRouteRepository.findOneByCompanyAndRouteName(
            companyId,
            routeName,
        );

        if (existRoute) {
            throw new ConflictException('Tên tuyến đã tồn tại.');
        }

        if (routeNameETicket) {
            const existET = await this.superAdminRouteRepository.findOneByCompanyAndETicketName(
                companyId,
                routeNameETicket,
            );
            if (existET) {
                throw new ConflictException('Tên tuyến điện tử đã tồn tại.');
            }
        }

        const maxOrder = await this.superAdminRouteRepository.getMaxDisplayOrder(companyId);
        const displayOrder = (maxOrder ?? 0) + 1;

        const created = await this.superAdminRouteRepository.createRoute(companyId, {
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
        return SuperAdminRouteMapper.toResponse(created);
    }
}