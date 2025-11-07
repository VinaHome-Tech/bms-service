import { Controller, HttpStatus } from '@nestjs/common';
import { VehicleService } from './bms_vehicle.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { DTO_RQ_Vehicle } from './bms_vehicle.dto';
import { DTO_RQ_UserAction } from 'src/utils/user.dto';

@Controller()
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  // M2_v2.F1
  @MessagePattern({ bms: 'get_list_vehicle_by_company_id' })
  async GetListVehicleByCompanyId(@Payload() id: string) {
    try { 
      const result = await this.vehicleService.GetListVehicleByCompanyId(id);
      return {
        success: true,
        statusCode: HttpStatus.OK,
        message: 'Success',
        result,
      };
    } catch (error) {
      throw new RpcException({
        success: false,
        message: error.response?.message || 'Service error!',
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  // M2_v2.F2
  @MessagePattern({ bms: 'create_vehicle' })
  async CreateVehicle(@Payload() payload: { id: string; data: DTO_RQ_Vehicle }) {
    try {
      const result = await this.vehicleService.CreateVehicle(
        payload.id,
        payload.data,
      );
      return {
        success: true,
        statusCode: HttpStatus.CREATED,
        message: 'Success',
        result,
      };
    } catch (error) {
      throw new RpcException({
        success: false,
        message: error.response?.message || 'Service error!',
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  // M2_v2.F3
  @MessagePattern({ bms: 'update_vehicle' })
  async updateVehicle(
    @Payload()
    payload: {id: number; data: DTO_RQ_Vehicle},
  ) {
    try {
      const result = await this.vehicleService.UpdateVehicle(
        payload.id,
        payload.data,
      );
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

  // M2_v2.F4
  @MessagePattern({ bms: 'delete_vehicle' })
  async DeleteVehicle(
    @Payload() payload: { id: number},
  ) {
    try {
      await this.vehicleService.DeleteVehicle(payload.id);
      return {
        success: true,
        statusCode: HttpStatus.OK,
        message: 'Success',
      };
    } catch (error) {
      throw new RpcException({
        success: false,
        message: error.response?.message || 'Server error',
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

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
  @MessagePattern({ bms: 'get_list_registration_expiry' })
  async getListRegistrationExpiry(@Payload() id: string) {
    try {
      const result = await this.vehicleService.getListRegistrationExpiry(id);
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
}
