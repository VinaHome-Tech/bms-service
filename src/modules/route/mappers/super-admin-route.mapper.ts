import { DTO_RP_SuperAdminRoute } from "../dtos/response/super-admin-route.dto";
import { RouteOrmEntity } from "../entities/RouteOrmEntity";

export class SuperAdminRouteMapper {
    static toResponse(entity: RouteOrmEntity): DTO_RP_SuperAdminRoute {
        return {
            id: entity.id,
            route_name: entity.route_name,
            short_name: entity.short_name,
            base_price: entity.base_price,
            route_name_e_ticket: entity.route_name_e_ticket,
            e_ticket_price: entity.e_ticket_price,
            distance: entity.distance,
            journey: entity.journey,
            note: entity.note,
            status: entity.status,
            created_at: entity.created_at,
            updated_at: entity.updated_at,
            display_order: entity.display_order,
        }
    }
    static toResponseList(entities: RouteOrmEntity[]): DTO_RP_SuperAdminRoute[] {
        return entities.map(entity => this.toResponse(entity));
    }
}