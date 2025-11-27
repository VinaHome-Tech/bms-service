import { Controller } from "@nestjs/common";
import { BmsConfigPointService } from "../services/bms_config_point.service";

@Controller('bms-config-point')
export class BmsConfigPointController {
    constructor(
        private readonly bmsConfigPointService: BmsConfigPointService
    ) {}
}