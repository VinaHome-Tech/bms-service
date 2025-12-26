import { DTO_RP_Route } from "../dtos/response/bms-route.response";
import { RouteOrmEntity } from "../entities/RouteOrmEntity";

export class BmsRouteMapper {
    static toResponse(entity: RouteOrmEntity): DTO_RP_Route {
        return {
            id: entity.id,
            route_name: entity.route_name,
            short_name: entity.short_name,
            base_price: entity.base_price,
            distance: entity.distance,
            e_ticket_price: entity.e_ticket_price,
            journey: entity.journey,
            note: entity.note,
            route_name_e_ticket: entity.route_name_e_ticket,
            status: entity.status,
            display_order: entity.display_order,
            created_at: entity.created_at,
            updated_at: entity.updated_at,
        };
    }   
    static toResponseList(entities: RouteOrmEntity[]): DTO_RP_Route[] {
        return entities.map((e) => this.toResponse(e));
    }
}