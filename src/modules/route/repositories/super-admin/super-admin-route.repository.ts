import { RouteOrmEntity } from "../../entities/RouteOrmEntity";


export abstract class SuperAdminRouteRepository {
    abstract findOneByCompanyAndRouteName(companyId: string, route_name: string): Promise<RouteOrmEntity>;
    abstract findOneByCompanyAndETicketName(companyId: string, eticketName: string): Promise<RouteOrmEntity>;

    abstract getMaxDisplayOrder(companyId: string): Promise<number>;

    abstract createRoute(
        companyId: string,
        data: Partial<RouteOrmEntity>
    ): Promise<RouteOrmEntity>;
    abstract findByCompanyId(companyId: string): Promise<RouteOrmEntity[]>;
    abstract findById(id: string): Promise<RouteOrmEntity>;
    abstract findByCompanyAndRouteName(companyId: string, routeName: string): Promise<RouteOrmEntity>;
    abstract updateRoute(route: Partial<RouteOrmEntity>): Promise<RouteOrmEntity>;
    abstract delete(id: string): Promise<void>;
}