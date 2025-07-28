import { DTO_RP_Route } from './route.dto';
import { Route } from './route.entity';

export class RouteMapper {
  static toDTO(route: Route): DTO_RP_Route {
    return {
      id: route.id,
      base_price: route.base_price,
      distance: route.distance,
      e_ticket_price: route.e_ticket_price,
      journey: route.journey,
      note: route.note,
      display_order: route.display_order,
      route_name: route.route_name,
      route_name_e_ticket: route.route_name_e_ticket,
      short_name: route.short_name,
      status: route.status,
    };
  }
}
