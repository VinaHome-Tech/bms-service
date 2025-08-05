import { Controller, HttpStatus } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { DTO_RQ_Vehicle } from './vehicle.dto';
import { DTO_RQ_UserAction } from 'src/utils/user.dto';

@Controller()
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @MessagePattern({ bms: 'create_vehicle' })
  async createVehicle(
    @Payload()
    payload: {
      user: DTO_RQ_UserAction;
      data_create: DTO_RQ_Vehicle;
    },
  ) {
    try {
      const result = await this.vehicleService.createVehicle(
        payload.user,
        payload.data_create,
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

  @MessagePattern({ bms: 'get_list_vehicle_by_company' })
  async getListVehicleByCompany(@Payload() id: string) {
    try {
      const result = await this.vehicleService.getListVehicleByCompany(id);
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

  @MessagePattern({ bms: 'update_vehicle' })
  async updateVehicle(
    @Payload()
    payload: {
      id: number;
      user: DTO_RQ_UserAction;
      data_update: DTO_RQ_Vehicle;
    },
  ) {
    try {
      const result = await this.vehicleService.updateVehicle(
        payload.id,
        payload.user,
        payload.data_update,
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

  @MessagePattern({ bms: 'delete_vehicle' })
  async deleteVehicle(
    @Payload() payload: { id: number; user: DTO_RQ_UserAction },
  ) {
    try {
      const result = await this.vehicleService.deleteVehicle(
        payload.id,
        payload.user,
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
