import { RouteName } from "../../domain/entities/route-name.entity";

export interface RouteRepositoryPort {
  findByCompanyId(id: string): Promise<RouteName[]>;
//   findAll(): Promise<RouteName[]>;
//   create(route: RouteName): Promise<void>;
}
export const ROUTE_REPOSITORY = "ROUTE_REPOSITORY";