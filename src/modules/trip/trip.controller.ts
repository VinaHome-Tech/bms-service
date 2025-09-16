import { Controller, HttpStatus } from '@nestjs/common';
import { TripService } from './trip.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import {
  DTO_RQ_ChangeTimeTrip,
  DTO_RQ_GetListTrip,
  DTO_RQ_UpdateTrip,
} from './trip.dto';
import { DTO_RQ_UserAction } from 'src/utils/user.dto';

@Controller()
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @MessagePattern({ bms: 'get_list_trip_by_route_and_date' })
  async getListTripByRouteAndDate(@Payload() data: DTO_RQ_GetListTrip) {
    try {
      const result = await this.tripService.getListTripByRouteAndDate(data);
      return {
        success: true,
        statusCode: HttpStatus.OK,
        message: 'Success',
        result,
      };
    } catch (error) {
      throw new RpcException({
        success: false,
        message: error.response?.message || 'Lỗi máy chủ dịch vụ!',
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @MessagePattern({ bms: 'delete_trip' })
  async deleteTrip(@Payload() id: number) {
    try {
      const result = await this.tripService.deleteTrip(id);
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

  @MessagePattern({ bms: 'confirmation_depart' })
  async confirmationDepart(@Payload() id: number) {
    try {
      const result = await this.tripService.confirmationDepart(id);
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

  @MessagePattern({ bms: 'change_time_trip' })
  async changeTimeTrip(
    @Payload()
    payload: {
      data_update: DTO_RQ_ChangeTimeTrip;
      id: number;
    },
  ) {
    try {
      const result = await this.tripService.changeTimeTrip(
        payload.data_update,
        payload.id,
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
        message: error.response?.message || 'Service error!',
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @MessagePattern({ bms: 'update_trip_information' })
  async updateTripInformation(
    @Payload()
    payload: {
      user: DTO_RQ_UserAction;
      data_update: DTO_RQ_UpdateTrip;
      id: number;
    },
  ) {
    try {
      const result = await this.tripService.updateTripInformation(
        payload.user,
        payload.data_update,
        payload.id,
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
        message: error.response?.message || 'Service error!',
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @MessagePattern({ bms: 'update_note' })
  async updateNote(@Payload() payload: { id: number; note: string }) {
    try {
      const result = await this.tripService.updateNote(
        payload.id,
        payload.note,
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
        message: error.response?.message || 'Service error!',
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
