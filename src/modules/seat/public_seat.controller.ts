import { Controller, Get, Query } from "@nestjs/common";
import { PublicSeatService } from "./public_seat.service";
import { MessagePattern, Payload } from "@nestjs/microservices";

@Controller('public-seat')
export class PublicSeatController {
  constructor(private readonly service: PublicSeatService) {}

  @MessagePattern('get_seat_detail_by_seat_chart_id')
  async GetSeatDetailsBySeatChartId(@Payload() data: { seatChartId: string }) {
    return this.service.GetSeatDetailsBySeatChartId(data.seatChartId);
  }
}