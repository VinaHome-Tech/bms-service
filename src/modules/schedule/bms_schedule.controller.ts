import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { BmsScheduleService } from "./bms_schedule.service";
import { TokenGuard } from "src/guards/token.guard";
import { Roles } from "src/decorator/roles.decorator";
import { CompanyIdParam } from "src/param/CompanyIdParam";
import { DTO_RQ_Schedule } from "./bms_schedule.dto";
import { NumberIdParam } from "src/param/NumberIdParam";

@Controller('bms-schedule')
@UseGuards(TokenGuard)
export class BmsScheduleController {
    constructor(private readonly service: BmsScheduleService) { }

    // M5_v2.F2
    @Post('companies/:id/schedules')
    @Roles('ADMIN')
    async CreateSchedule(@Param() param: CompanyIdParam, @Body() data: DTO_RQ_Schedule) {
        return this.service.CreateSchedule(param.id, data);
    }

    // M5_v2.F1
    @Get('companies/:id/schedules')
    @Roles('ADMIN')
    async GetListScheduleByCompanyId(@Param() param: CompanyIdParam) {
        return this.service.GetListScheduleByCompanyId(param.id);
    }

    // M5_v2.F3
    @Put(':id')
    @Roles('ADMIN')
    async UpdateSchedule(@Param() param: NumberIdParam, @Body() data: DTO_RQ_Schedule) {
        return this.service.UpdateSchedule(param.id, data);
    }

    // M5_v2.F4
    @Delete(':id')
    @Roles('ADMIN')
    async DeleteSchedule(@Param() param: NumberIdParam) {
        return this.service.DeleteSchedule(param.id);
    }
}