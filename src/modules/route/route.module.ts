import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BmsRouteController } from "./controllers/bms-route.controller";
import { RouteRepository } from "./repositories/bms/route.repository";
import { TypeOrmRouteRepository } from "./repositories/bms/typeorm-route.repository";
import { GetRouteNameListByCompanyIdUseCase } from "./use-case/bms/get-route-name-list-by-company-id.usecase";
import { RouteOrmEntity } from "./entities/RouteOrmEntity";
import { GetRouteListByCompanyIdUseCase } from "./use-case/bms/get-route-list-by-company-id.usecase";
import { Schedule } from "src/entities/schedule.entity";
import { GetRouteNameActionListByCompanyIdUseCase } from "./use-case/bms/get-route-name-action-list-by-company-id.usecase";
import { CreateRouteUseCase } from "./use-case/bms/create-route.usecase";
import { UpdateRouteUseCase } from "./use-case/bms/update-route.usecase";
import { DeleteRouteUseCase } from "./use-case/bms/delete-route.usecase";
import { GetListRouteNameToConfigUseCase } from "./use-case/bms/get-list-route-name-to-config.usecase";

import { SuperAdminRouteController } from "./controllers/super-admin-route.controller";
import { SuperAdminCreateRouteUseCase } from "./use-case/super-admin/create-route.usecase";
import { SuperAdminGetAllRouteByCompanyUseCase } from "./use-case/super-admin/get-all-route-by-company.usecase";
import { SuperAdminUpdateRouteUseCase } from "./use-case/super-admin/update-route.usecase";
import { SuperAdminDeleteRouteUseCase } from "./use-case/super-admin/delete-route.usecase";
import { SuperAdminRouteRepository } from "./repositories/super-admin/super-admin-route.repository";
import { SuperAdminTypeOrmRouteRepository } from "./repositories/super-admin/super-admin-typeorm-route.repository";

@Module({
    imports: [TypeOrmModule.forFeature([RouteOrmEntity, Schedule])],
    controllers: [BmsRouteController, SuperAdminRouteController],
    providers: [
        {
            provide: SuperAdminRouteRepository,
            useClass: SuperAdminTypeOrmRouteRepository,
        },
        SuperAdminCreateRouteUseCase,
        SuperAdminGetAllRouteByCompanyUseCase,
        SuperAdminUpdateRouteUseCase,
        SuperAdminDeleteRouteUseCase,
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
        GetListRouteNameToConfigUseCase,
    ],
    exports: [],
})
export class RouteModule2 {}