import { Controller, Get, Query } from "@nestjs/common";
import { PublicScheduleService } from "./public_schedule.service";
import { MessagePattern, Payload } from "@nestjs/microservices";

@Controller('public-schedule')
export class PublicScheduleController {
    constructor(private readonly service: PublicScheduleService) { }

    @MessagePattern('get_schedule_detail')
    async getSchedules(@Payload() data: { company_id: string; route_id: string }) {
        const { company_id, route_id } = data;
        return this.service.GetSchedulesByCompanyAndRoute(company_id, route_id);
    }
}