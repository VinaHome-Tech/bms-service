import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProvinceOrmEntity } from "src/modules/point/entities/ProvinceOrmEntity";
import { BmsPointService } from "./bms/bms_point.service";
import { WardOrmEntity } from "src/modules/point/entities/WardOrmEntity";
import { BmsPointController } from "./controllers/bms_point.controller";
import { GlobalPointOrmEntity } from "./entities/GlobalPointOrmEntity";
import { PointRepository } from "./repositories/point.repository";
import { TypeOrmPointRepository } from "./repositories/typeorm-point.repository";
import { GetAllProvinceNameUseCase } from "./use-cases/super-admin/get-all-province-name.usecase";
import { SuperAdminPointController } from "./controllers/super-admin-point.controller";
import { GetWardsByProvinceCodeUseCase } from "./use-cases/super-admin/get-wards-by-province-code.usecase";
import { CreateGlobalPointUseCase } from "./use-cases/super-admin/create-global-point.usecase";
import { GetAllGlobalPointUseCase } from "./use-cases/super-admin/get-all-global-point.usecase";
import { UpdateGlobalPointUseCase } from "./use-cases/super-admin/update-global-point.usecase";


@Module({
    imports: [TypeOrmModule.forFeature([ProvinceOrmEntity, WardOrmEntity, GlobalPointOrmEntity])],
    controllers: [BmsPointController, SuperAdminPointController],
    providers: [
        {
            provide: PointRepository,
            useClass: TypeOrmPointRepository,
        },
        GetAllProvinceNameUseCase,
        GetWardsByProvinceCodeUseCase,
        CreateGlobalPointUseCase,
        GetAllGlobalPointUseCase,
        UpdateGlobalPointUseCase,
        BmsPointService],
    exports: []
})
export class PointModule {}