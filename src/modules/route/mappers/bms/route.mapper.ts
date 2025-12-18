import { DTO_RP_Route } from "src/modules/route_2/route.dto";
import { RouteOrmEntity } from "../../entities/RouteOrmEntity";

export class RouteMapper {
    static toResponse(entity: RouteOrmEntity): DTO_RP_Route {
        return {
            id: entity.id,
            display_order: entity.display_order,
            distance: entity.distance,
            e_ticket_price: entity.e_ticket_price,
            journey: entity.journey,
            note: entity.note,
            route_name: entity.route_name,
            route_name_e_ticket: entity.route_name_e_ticket,
            short_name: entity.short_name,
            status: entity.status,
            base_price: entity.base_price,
        };
    }
}