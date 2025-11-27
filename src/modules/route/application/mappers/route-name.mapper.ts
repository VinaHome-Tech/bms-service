import { RouteName } from "../../domain/entities/route-name.entity";
import { RouteResponseDto } from "../dto/route-name-response.dto";

export class RouteNameMapper {
  static toResponse(route: RouteName): RouteResponseDto {
    return {
      id: route.id,
      route_name: route.route_name,
    };
  }
}