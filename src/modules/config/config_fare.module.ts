import { Module } from "@nestjs/common";
import { BmsConfigFareService } from "./bms_config_fare.service";
import { BmsConfigFareController } from "./bms_config_fare.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FareConfig } from "src/entities/fare-config.entity";
import { ConfigFare } from "src/entities/config-fare.entity";
import { Route } from "src/entities/route.entity";
import { RouteModule } from "../route/route.module";
import { SeatChart } from "src/entities/seat_chart.entity";

@Module({
    imports: [TypeOrmModule.forFeature([FareConfig, ConfigFare, Route, SeatChart])],
    controllers: [BmsConfigFareController],
    providers: [BmsConfigFareService],
})
export class ConfigFareModule {}