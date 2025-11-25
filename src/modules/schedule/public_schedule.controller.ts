import { Controller, Get, Query } from "@nestjs/common";
import { PublicScheduleService } from "./public_schedule.service";

@Controller('public-schedule')
export class PublicScheduleController {
    constructor(private readonly service: PublicScheduleService) { }

    // @Get()
    // async getSchedules(
    //     @Query('company_id') companyId: string,
    //     @Query('route_id') routeId: number,
    // ){
    //     return this.service.GetSchedulesByCompanyAndRoute(companyId, routeId);
    // }
}