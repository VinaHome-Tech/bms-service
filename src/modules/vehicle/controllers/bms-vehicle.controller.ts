import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { TokenGuard } from 'src/guards/token.guard';
import { Roles } from 'src/decorator/roles.decorator';
import { CompanyIdParam } from 'src/param/CompanyIdParam';
import { UUIDParam } from 'src/param/UUIDParam';
import { TimingInterceptor } from 'src/shared/timing-interceptor';
import { DTO_RQ_Vehicle } from '../dtos/request/bms/bms-vehicle.request';
import { CreateVehicleUseCase } from '../use-cases/bms/create-vehicle.usecase';
import { ResponseResult } from 'src/shared/response/result';
import { GetVehicleListByCompanyIdUseCase } from '../use-cases/bms/get-vehicle-list-by-company-id.usecase';
import { UpdateVehicleUseCase } from '../use-cases/bms/update-vehice.usecase';
import { DeleteVehicleUseCase } from '../use-cases/bms/delete-vehicle.usecase';

@Controller('bms-vehicle')
@UseGuards(TokenGuard)
export class BmsVehicleController {
  constructor(
    private readonly createVehicleUseCase: CreateVehicleUseCase,
    private readonly updateVehicleUseCase: UpdateVehicleUseCase,
    private readonly deleteVehicleUseCase: DeleteVehicleUseCase,
    private readonly getVehicleListByCompanyIdUseCase: GetVehicleListByCompanyIdUseCase,

  ) {}

  // M2_v2.F1
  @Get('companies/:id/vehicles')
  @Roles('ADMIN')
  async GetListVehicleByCompanyId(@Param() param: UUIDParam) {
    const result = await this.getVehicleListByCompanyIdUseCase.execute(param.id);
    return new ResponseResult(true, HttpStatus.OK, 'Success', result);
  }

  // M2_v2.F2
  @UseInterceptors(TimingInterceptor)
  @Post('companies/:id/vehicles')
  @Roles('ADMIN')
  async CreateVehicle(@Param() param: UUIDParam, @Body() data: DTO_RQ_Vehicle) { 
    const result = await this.createVehicleUseCase.execute(param.id, data);
    return new ResponseResult(true, HttpStatus.CREATED, 'Success', result);
  }

  // M2_v2.F3
  @UseInterceptors(TimingInterceptor)
  @Put(':id')
  @Roles('ADMIN')
  async UpdateVehicle(
    @Param() param: UUIDParam,
    @Body() data: DTO_RQ_Vehicle,
  ) {
    const result = await this.updateVehicleUseCase.execute(param.id, data);
    return new ResponseResult(true, HttpStatus.OK, 'Success', result);
  }

  // M2_v2.F4
  @Delete(':id')
  @Roles('ADMIN')
  async DeleteVehicle(@Param() param: UUIDParam) {
    const result = await this.deleteVehicleUseCase.execute(param.id);
    return new ResponseResult(true, HttpStatus.OK, 'Success', result);
  }

  @Get('companies/:id/vehicles/license-plates')
  @Roles('ADMIN', 'STAFF')
  async GetListLicensePlateVehicleByCompanyId(@Param() param: CompanyIdParam) {
    // return await this.vehicleService.GetListLicensePlateVehicleByCompanyId(
    //   param.id,
    // );
  }
  // @MessagePattern({ bms: 'delete_vehicle' })
  // async DeleteVehicle(
  //   @Payload() payload: { id: number},
  // ) {
  //   try {
  //     await this.vehicleService.DeleteVehicle(payload.id);
  //     return {
  //       success: true,
  //       statusCode: HttpStatus.OK,
  //       message: 'Success',
  //     };
  //   } catch (error) {
  //     throw new RpcException({
  //       success: false,
  //       message: error.response?.message || 'Server error',
  //       statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
  //     });
  //   }
  // }

  // @MessagePattern({ bms: 'get_list_vehicle_by_company' })
  // async getListVehicleByCompany(@Payload() id: string) {
  //   try {
  //     const result = await this.vehicleService.getListVehicleByCompany(id);
  //     return {
  //       success: true,
  //       statusCode: HttpStatus.OK,
  //       message: 'Success',
  //       result,
  //     };
  //   } catch (error) {
  //     throw new RpcException({
  //       success: false,
  //       message: error.response?.message || 'Service error!',
  //       statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
  //     });
  //   }
  // }

  

  

  // BM-32: Get License Plate By Company
  // @MessagePattern({ bms: 'get_license_plate_by_company' })
  // async getLicensePlateByCompany(@Payload() id: string) {
  //   try {
  //     // const result = await this.vehicleService.getLicensePlateByCompany(id);
  //     // return {
  //     //   success: true,
  //     //   statusCode: HttpStatus.OK,
  //     //   message: 'Success',
  //     //   result,
  //     // };
  //   } catch (error) {
  //     throw new RpcException({
  //       success: false,
  //       message: error.response?.message || 'Server error',
  //       statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
  //     });
  //   }
  // }

  // BM-34 Get List Registration Expiry
  // @MessagePattern({ bms: 'get_list_registration_expiry' })
  // async getListRegistrationExpiry(@Payload() id: string) {
  //   try {
  //     const result = await this.vehicleService.getListRegistrationExpiry(id);
  //     return {
  //       success: true,
  //       statusCode: HttpStatus.OK,
  //       message: 'Success',
  //       result,
  //     };
  //   } catch (error) {
  //     throw new RpcException({
  //       success: false,
  //       message: error.response?.message || 'Server error',
  //       statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
  //     });
  //   }
  // }
}
