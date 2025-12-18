import { DTO_RP_RouteNameToConfig } from "../../dtos/response/bms/route-name-to-config.dto";
import { RouteOrmEntity } from "../../entities/RouteOrmEntity";

export class RouteNameToConfigMapper {
  static toResponse(entity: RouteOrmEntity): DTO_RP_RouteNameToConfig {
    return {
      id: entity.id,
      route_name: entity.route_name,
      base_price: entity.base_price,
    };
  }
}