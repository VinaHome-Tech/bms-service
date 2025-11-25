// import { Module } from "@nestjs/common";
// import { TypeOrmModule } from "@nestjs/typeorm";
// import { Province } from "src/entities/provinces.entity";
// import { Ward } from "src/entities/wards.entity";
// import { PlatformPointController } from "./platform_point.controller";
// import { PlatformPointService } from "./platform_point.service";
// import { Point } from "src/entities/point.entity";
// import { BmsPointController } from "./bms_point.controller";
// import { BmsPointService } from "./bms_point.service";
// import { RoutePoint } from "src/entities/route_point.entity";

// @Module({
//     imports: [TypeOrmModule.forFeature([Province, Ward, Point, RoutePoint])],
//     controllers: [PlatformPointController, BmsPointController],
//     providers: [PlatformPointService, BmsPointService],
//     exports: []
// })
// export class PointModule {}