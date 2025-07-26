import { Controller, HttpStatus } from '@nestjs/common';
import { TripService } from './trip.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { DTO_RQ_GetListTrip, DTO_RQ_UpdateTrip } from './trip.dto';

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
        message: 'Lấy danh sách chuyến thành công',
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

  @MessagePattern({ bms: 'update_trip_information' })
  async updateTripInformation(
    @Payload() payload: { data: DTO_RQ_UpdateTrip; id: number },
  ) {
    try {
      const result = await this.tripService.updateTripInformation(
        payload.data,
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
        message: error.response?.message || 'Server Error',
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
