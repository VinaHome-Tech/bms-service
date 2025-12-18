import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, UseGuards, UseInterceptors } from "@nestjs/common";
import { TokenGuard } from "src/guards/token.guard";
import { BmsOfficeService } from "../bms_office.service";
import { Roles } from "src/decorator/roles.decorator";
import { UUIDParam } from "src/param/UUIDParam";
import { DTO_RQ_Office } from "../bms_office.dto";
import { ResponseResult } from "src/shared/response/result";
import { CreateOfficeUseCase } from "../use-cases/bms/create-office.usecase";
import { TimingInterceptor } from "src/shared/timing-interceptor";
import { GetOfficeListByCompanyIdUseCase } from "../use-cases/bms/get-office-list-by-company-id.usecase";
import { UpdateOfficeUseCase } from "../use-cases/bms/update-office.usecase";
import { DeleteOfficeUseCase } from "../use-cases/bms/delete-office.usecase";

@Controller('bms-office')
@UseGuards(TokenGuard)
export class BmsOfficeController {
  constructor(
    private readonly service: BmsOfficeService,
    private readonly createOfficeUseCase: CreateOfficeUseCase,
    private readonly updateOfficeUseCase: UpdateOfficeUseCase,
    private readonly deleteOfficeUseCase: DeleteOfficeUseCase,
    private readonly getOfficeListByCompanyIdUseCase: GetOfficeListByCompanyIdUseCase,
) {}

  // M1_v2.F1
  @Get('companies/:id/room-work')
  @Roles('ADMIN', 'STAFF')
  async GetListOfficeRoomWorkByCompanyId(@Param() param: UUIDParam) {
    return await this.service.GetListOfficeRoomWorkByCompanyId(param.id);
  }

  // M1_v2.F2
  @UseInterceptors(TimingInterceptor)
  @Get('companies/:id/offices')
  @Roles('ADMIN')
  async GetListOfficeByCompanyId(@Param() param: UUIDParam) {
    const result = await this.getOfficeListByCompanyIdUseCase.execute(param.id);
    return new ResponseResult(true, HttpStatus.OK, 'Success', result);
  }

  // M1_v2.F3
  @UseInterceptors(TimingInterceptor)
  @Post('companies/:id/offices')
  @Roles('ADMIN')
  async CreateOffice(@Param() param: UUIDParam, @Body() data: DTO_RQ_Office) {
    const result = await this.createOfficeUseCase.execute(param.id, data);
    return new ResponseResult(true, HttpStatus.OK, 'Success', result);
  }

  // M1_v2.F4
  @UseInterceptors(TimingInterceptor)
  @Put(':id')
  @Roles('ADMIN')
  async UpdateOffice(@Param() param: UUIDParam, @Body() data: DTO_RQ_Office) {
    const result = await this.updateOfficeUseCase.execute(param.id, data);
    return new ResponseResult(true, HttpStatus.OK, 'Success', result);
  }
  
  // M1_v2.F5
  @UseInterceptors(TimingInterceptor)
  @Delete(':id')
  @Roles('ADMIN')
  async DeleteOffice(@Param() param: UUIDParam) {
    const result = await this.deleteOfficeUseCase.execute(param.id);
    return new ResponseResult(true, HttpStatus.OK, 'Success', result);
  }
}