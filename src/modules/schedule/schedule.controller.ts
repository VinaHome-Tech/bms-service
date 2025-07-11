import { Controller, HttpStatus } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { DTO_RQ_CreateSchedule, DTO_RQ_UpdateSchedule } from './schedule.dto';

@Controller()
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @MessagePattern({ bms: 'create_schedule' })
  async createSchedule(data: DTO_RQ_CreateSchedule) {
    try {
      const result = await this.scheduleService.createSchedule(data);
      return {
        success: true,
        statusCode: HttpStatus.CREATED,
        message: 'Tạo lịch chạy thành công',
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

  @MessagePattern({ bms: 'get_list_schedules_by_company' })
  async getListSchedulesByCompany(@Payload() id: number) {
    try {
      const result = await this.scheduleService.getListSchedulesByCompany(id);
      return {
        success: true,
        statusCode: HttpStatus.OK,
        message: 'Lấy danh sách lịch chạy thành công',
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

  @MessagePattern({ bms: 'delete_schedule' })
  async deleteSchedule(@Payload() id: number) {
    try {
      const result = await this.scheduleService.deleteSchedule(id);
      return {
        success: true,
        statusCode: HttpStatus.OK,
        message: 'Xóa lịch chạy thành công',
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

  @MessagePattern({ bms: 'update_schedule' })
  async updateSchedule(
    @Payload() payload: { id: number; data: DTO_RQ_UpdateSchedule },
  ) {
    try {
      const result = await this.scheduleService.updateSchedule(
        payload.id,
        payload.data,
      );
      return {
        success: true,
        statusCode: HttpStatus.OK,
        message: 'Cập nhật lịch chạy thành công',
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
