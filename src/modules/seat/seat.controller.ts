import { Controller, HttpStatus } from '@nestjs/common';
import { SeatService } from './seat.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { DTO_RQ_CreateSeatChart, DTO_RQ_UpdateSeatChart } from './seat.dto';

@Controller()
export class SeatController {
  constructor(private readonly seatService: SeatService) {}

  @MessagePattern({ bms: 'create_seat_chart' })
  async createSeatChart(@Payload() data: DTO_RQ_CreateSeatChart) {
    try {
      const result = await this.seatService.createSeatChart(data);
      return {
        success: true,
        statusCode: HttpStatus.CREATED,
        message: 'Tạo sơ đồ ghế thành công',
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

  @MessagePattern({ bms: 'get_seat_chart_by_company' })
  async getSeatChartByCompany(@Payload() id: number) {
    try {
      const result = await this.seatService.getSeatChartByCompany(id);
      return {
        success: true,
        statusCode: HttpStatus.OK,
        message: 'Lấy danh sách sơ đồ ghế thành công',
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

  @MessagePattern({ bms: 'delete_seat_chart' })
  async deleteSeatChart(@Payload() id: number) {
    try {
      const result = await this.seatService.deleteSeatChart(id);
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
    @Payload() payload: { id: number; data: DTO_RQ_UpdateSeatChart },
  ) {
    try {
      const result = await this.seatService.updateSeatChart(
        payload.id,
        payload.data,
      );
      return {
        success: true,
        statusCode: HttpStatus.OK,
        message: 'Cập nhật sơ đồ ghế thành công',
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

  @MessagePattern({ bms: 'get_seat_chart_name_by_company' })
  async getSeatChartNameByCompany(@Payload() id: number) {
    try {
      const result = await this.seatService.getSeatChartNameByCompany(id);
      return {
        success: true,
        statusCode: HttpStatus.OK,
        message: 'Lấy danh sách tên sơ đồ ghế thành công',
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
}
