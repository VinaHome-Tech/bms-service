import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RouteOrmEntity } from "./infrastructure/orm/route.orm-entity";
import { BmsRouteController } from "./presentation/controllers/bms-route.controller";
import { LoggerAdapter } from "./infrastructure/adapters/logger.adapter";
import { RouteNameDomainService } from "./domain/services/route-name-domain.service";
import { RouteRepository } from "./infrastructure/repositories/route.repository";
import { ROUTE_REPOSITORY } from "./application/ports/route-repository.port";
import { GetRouteNameListByCompanyIdUseCase } from "./application/use-cases/get-route-name-list-by-company-id.use-case";

@Module({
    imports: [TypeOrmModule.forFeature([RouteOrmEntity])],
    controllers: [BmsRouteController],
    providers: [
        LoggerAdapter,
        RouteNameDomainService,
        RouteRepository,
        {
            provide: ROUTE_REPOSITORY,
            useExisting: RouteRepository,
        },
        {
            provide: GetRouteNameListByCompanyIdUseCase,
            useFactory: (repo: RouteRepository) => {
                return new GetRouteNameListByCompanyIdUseCase(repo);
            },
            inject: [RouteRepository],
        }
    ],
    exports: [],
})
export class RouteModule2 {}