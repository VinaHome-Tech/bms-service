import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Province } from "src/entities/provinces.entity";
import { Ward } from "src/entities/wards.entity";
import { PlatformPointController } from "./platform_point.controller";
import { PlatformPointService } from "./platform_point.service";
import { Point } from "src/entities/point.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Province, Ward, Point])],
    controllers: [PlatformPointController],
    providers: [PlatformPointService],
    exports: []
})
export class PointModule {}