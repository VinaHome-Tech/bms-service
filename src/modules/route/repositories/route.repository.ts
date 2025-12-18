import { RouteOrmEntity } from "../entities/RouteOrmEntity";

export abstract class RouteRepository {
  abstract findNameByCompanyId(companyId: string): Promise<RouteOrmEntity[]>;
  abstract findByCompanyId(companyId: string): Promise<RouteOrmEntity[]>;
  abstract findNameActionByCompanyId(companyId: string): Promise<RouteOrmEntity[]>;
  abstract findOneByCompanyAndRouteName(companyId: string, route_name: string): Promise<RouteOrmEntity>;
  abstract findOneByCompanyAndShortName(companyId: string, short_name: string): Promise<RouteOrmEntity>;
  abstract findOneByCompanyAndETicketName(companyId: string, eticketName: string): Promise<RouteOrmEntity>;

  abstract getMaxDisplayOrder(companyId: string): Promise<number>;
  
  abstract createRoute(
    companyId: string,
    data: Partial<RouteOrmEntity>
  ): Promise<RouteOrmEntity>;

  abstract findById(id: string): Promise<RouteOrmEntity>;
  abstract findByCompanyAndRouteName(companyId: string, routeName: string): Promise<RouteOrmEntity>;
  abstract findByCompanyAndShortName(companyId: string, shortName: string): Promise<RouteOrmEntity>;
  abstract findByCompanyAndETicketName(companyId: string, eticketName: string): Promise<RouteOrmEntity>;

  abstract updateRoute(route: RouteOrmEntity): Promise<RouteOrmEntity>;
  abstract delete(id: string): Promise<void>;
}