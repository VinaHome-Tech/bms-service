import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BmsRouteController } from "./controllers/bms-route.controller";
import { RouteRepository } from "./repositories/route.repository";
import { TypeOrmRouteRepository } from "./repositories/typeorm-route.repository";
import { GetRouteNameListByCompanyIdUseCase } from "./use-case/bms/get-route-name-list-by-company-id.usecase";
import { RouteOrmEntity } from "./entities/RouteOrmEntity.entity";
import { GetRouteListByCompanyIdUseCase } from "./use-case/bms/get-route-list-by-company-id.usecase";
import { Schedule } from "src/entities/schedule.entity";
import { GetRouteNameActionListByCompanyIdUseCase } from "./use-case/bms/get-route-name-action-list-by-company-id.usecase";
import { CreateRouteUseCase } from "./use-case/bms/create-route.usecase";
import { UpdateRouteUseCase } from "./use-case/bms/update-route.usecase";
import { DeleteRouteUseCase } from "./use-case/bms/delete-route.usecase";

@Module({
    imports: [TypeOrmModule.forFeature([RouteOrmEntity, Schedule])],
    controllers: [BmsRouteController],
    providers: [
        {
            provide: RouteRepository,
            useClass: TypeOrmRouteRepository,
        },
        GetRouteNameListByCompanyIdUseCase,
        GetRouteListByCompanyIdUseCase,
        GetRouteNameActionListByCompanyIdUseCase,
        CreateRouteUseCase,
        UpdateRouteUseCase,
        DeleteRouteUseCase,
    ],
    exports: [],
})
export class RouteModule2 {}