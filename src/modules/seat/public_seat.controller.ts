import { Controller, Get, Query } from "@nestjs/common";
import { PublicSeatService } from "./public_seat.service";

@Controller('public-seat')
export class PublicSeatController {
  constructor(private readonly service: PublicSeatService) {}

  @Get()
  async GetSeatDetailsBySeatChartId(@Query('seat_chart_id') seatChartId: string) {
    return this.service.GetSeatDetailsBySeatChartId(seatChartId);
  }
}