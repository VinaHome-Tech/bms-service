import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { VehicleService } from './bms_vehicle.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { DTO_RQ_Vehicle } from './bms_vehicle.dto';
import { DTO_RQ_UserAction } from 'src/utils/user.dto';
import { TokenGuard } from 'src/guards/token.guard';
import { Roles } from 'src/decorator/roles.decorator';
import { CompanyIdParam } from 'src/param/CompanyIdParam';
import { NumberIdParam } from 'src/param/NumberIdParam';
import { UUIDParam } from 'src/param/UUIDParam';

@Controller('bms-vehicle')
@UseGuards(TokenGuard)
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  // M2_v2.F1
  @Get('companies/:id/vehicles')
  @Roles('ADMIN')
  async GetListVehicleByCompanyId(@Param() param: UUIDParam) {
    return await this.vehicleService.GetListVehicleByCompanyId(param.id);
  }

  // M2_v2.F2
  @Post('companies/:id/vehicles')
  @Roles('ADMIN')
  async CreateVehicle(@Param() param: UUIDParam, @Body() data: DTO_RQ_Vehicle) { 
    return await this.vehicleService.CreateVehicle(
      param.id,
      data,
    );
  }

  // M2_v2.F3
  @Put(':id')
  @Roles('ADMIN')
  async UpdateVehicle(
    @Param() param: UUIDParam,
    @Body() data: DTO_RQ_Vehicle,
  ) {
    return await this.vehicleService.UpdateVehicle(param.id, data);
  }

  // M2_v2.F4
  @Delete(':id')
  @Roles('ADMIN')
  async DeleteVehicle(@Param() param: UUIDParam) {
    return await this.vehicleService.DeleteVehicle(param.id);
  }

  @Get('companies/:id/vehicles/license-plates')
  @Roles('ADMIN', 'STAFF')
  async GetListLicensePlateVehicleByCompanyId(@Param() param: CompanyIdParam) {
    return await this.vehicleService.GetListLicensePlateVehicleByCompanyId(
      param.id,
    );
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
  @MessagePattern({ bms: 'get_license_plate_by_company' })
  async getLicensePlateByCompany(@Payload() id: string) {
    try {
      const result = await this.vehicleService.getLicensePlateByCompany(id);
      return {
        success: true,
        statusCode: HttpStatus.OK,
        message: 'Success',
        result,
      };
    } catch (error) {
      throw new RpcException({
        success: false,
        message: error.response?.message || 'Server error',
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

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
