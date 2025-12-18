import { DTO_RP_RouteName } from "../../dtos/response/bms/route-name.dto";
import { RouteOrmEntity } from "../../entities/RouteOrmEntity";

export class RouteNameMapper {
  static toResponse(entity: RouteOrmEntity): DTO_RP_RouteName {
    return {
      id: entity.id,
      route_name: entity.route_name,
    };
  }
}