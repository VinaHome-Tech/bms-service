import { Controller, HttpStatus } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { DTO_RQ_CreateVehicle, DTO_RQ_UpdateVehicle } from './vehicle.dto';

@Controller()
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @MessagePattern({ bms: 'create_vehicle' })
  async createVehicle(@Payload() data: DTO_RQ_CreateVehicle) {
    try {
      const result = await this.vehicleService.createVehicle(data);
      return {
        success: true,
        statusCode: HttpStatus.CREATED,
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

  @MessagePattern({ bms: 'get_list_vehicle_by_company' })
  async getListVehicleByCompany(@Payload() id: number) {
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
        message: error.response?.message || 'Server error',
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @MessagePattern({ bms: 'update_vehicle' })
  async updateVehicle(
    @Payload() payload: { id: number; data: DTO_RQ_UpdateVehicle },
  ) {
    try {
      const result = await this.vehicleService.updateVehicle(
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

  @MessagePattern({ bms: 'delete_vehicle' })
  async deleteVehicle(@Payload() id: number) {
    try {
      const result = await this.vehicleService.deleteVehicle(id);
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
  async getLicensePlateByCompany(@Payload() id: number) {
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
}
