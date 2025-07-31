import { Controller, HttpStatus } from '@nestjs/common';
import { SeatService } from './seat.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { DTO_RQ_CreateSeatChart, DTO_RQ_UpdateSeatChart } from './seat.dto';
import { DTO_RQ_UserAction } from 'src/utils/user.dto';

@Controller()
export class SeatController {
  constructor(private readonly seatService: SeatService) {}

  @MessagePattern({ bms: 'create_seat_chart' })
  async createSeatChart(
    @Payload()
    payload: {
      user: DTO_RQ_UserAction;
      data_create: DTO_RQ_CreateSeatChart;
    },
  ) {
    try {
      const result = await this.seatService.createSeatChart(
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

  @MessagePattern({ bms: 'get_seat_chart_by_company' })
  async getSeatChartByCompany(@Payload() id: string) {
    try {
      const result = await this.seatService.getSeatChartByCompany(id);
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

  @MessagePattern({ bms: 'delete_seat_chart' })
  async deleteSeatChart(
    @Payload() payload: { id: number; user: DTO_RQ_UserAction },
  ) {
    try {
      const result = await this.seatService.deleteSeatChart(
        payload.id,
        payload.user,
      );
      return {
        success: true,
        statusCode: HttpStatus.OK,
        message: 'Xóa sơ đồ ghế thành công',
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

  @MessagePattern({ bms: 'update_seat_chart' })
  async updateSeatChart(
    @Payload() payload: { id: number; data_update: DTO_RQ_UpdateSeatChart },
  ) {
    try {
      const result = await this.seatService.updateSeatChart(
        payload.id,
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
        message: error.response?.message || 'Service error!',
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @MessagePattern({ bms: 'get_seat_chart_name_by_company' })
  async getSeatChartNameByCompany(@Payload() id: string) {
    try {
      const result = await this.seatService.getSeatChartNameByCompany(id);
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
