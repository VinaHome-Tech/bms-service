import { Module } from "@nestjs/common";
import { BmsConfigPointController } from "./controllers/bms_config_point.controller";
import { BmsConfigPointService } from "./services/bms_config_point.service";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [TypeOrmModule.forFeature([])],
    controllers: [BmsConfigPointController],
    providers: [BmsConfigPointService],
})
export class ConfigAppModule {}