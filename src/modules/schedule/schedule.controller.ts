import { Controller, HttpStatus } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { DTO_RQ_CreateSchedule } from './schedule.dto';

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
        message: 'Tạo lịch trình thành công',
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
