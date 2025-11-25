import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { TokenGuard } from "src/guards/token.guard";
import { BmsSeatService } from "./bms_seat.service";
import { Roles } from "src/decorator/roles.decorator";
import { CompanyIdParam } from "src/param/CompanyIdParam";
import { DTO_RQ_SeatChart } from "./bms_seat.dto";
import { NumberIdParam } from "src/param/NumberIdParam";
import { UUIDParam } from "src/param/UUIDParam";

@Controller('bms-seat')
@UseGuards(TokenGuard)
export class BmsSeatController {
  constructor(private readonly service: BmsSeatService) {}

  // M4_v2.F2
  @Post('companies/:id/seat-charts')
  @Roles('ADMIN')
  async CreateSeatChart(@Param() param: UUIDParam, @Body() data: DTO_RQ_SeatChart) {
    console.log(param.id, data);
    return this.service.CreateSeatChart(param.id, data);
  }

  // M4_v2.F1
  @Get('companies/:id/seat-charts')
  @Roles('ADMIN')
  async GetListSeatChartByCompanyId(@Param() param: UUIDParam) {
    return this.service.GetListSeatChartByCompanyId(param.id);
  }

  // M4_v2.F3
  @Put(':id')
  @Roles('ADMIN')
  async UpdateSeatChart(@Param() param: any, @Body() data: DTO_RQ_SeatChart) {
    return this.service.UpdateSeatChart(param.id, data);
  }

  // M4_v2.F4
  @Delete(':id')
  @Roles('ADMIN')
  async DeleteSeatChart(@Param() param: any) {
    return this.service.DeleteSeatChart(param.id);
  }

  // M4_v2.F5
  @Get('companies/:id/seat-charts-name')
  @Roles('ADMIN')
  async GetListSeatChartNameByCompanyId(@Param() param: CompanyIdParam) {
    return this.service.GetListSeatChartNameByCompanyId(param.id);
  }
}