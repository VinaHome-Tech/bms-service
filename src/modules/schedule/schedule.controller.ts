import { Controller, HttpStatus } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { DTO_RQ_Schedule } from './schedule.dto';
import { DTO_RQ_UserAction } from 'src/utils/user.dto';

@Controller()
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  // @MessagePattern({ bms: 'create_schedule' })
  // async createSchedule(
  //   @Payload()
  //   payload: {
  //     user: DTO_RQ_UserAction;
  //     data_create: DTO_RQ_Schedule;
  //   },
  // ) {
  //   try {
  //     const result = await this.scheduleService.createSchedule(
  //       payload.user,
  //       payload.data_create,
  //     );
  //     return {
  //       success: true,
  //       statusCode: HttpStatus.CREATED,
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

  @MessagePattern({ bms: 'get_list_schedules_by_company' })
  async getListSchedulesByCompany(@Payload() id: string) {
    try {
      const result = await this.scheduleService.getListSchedulesByCompany(id);
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

  @MessagePattern({ bms: 'delete_schedule' })
  async deleteSchedule(
    @Payload() payload: { id: number; user: DTO_RQ_UserAction },
  ) {
    try {
      const result = await this.scheduleService.deleteSchedule(
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
        message: error.response?.message || 'Service error!',
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  // @MessagePattern({ bms: 'update_schedule' })
  // async updateSchedule(
  //   @Payload()
  //   payload: {
  //     id: number;
  //     user: DTO_RQ_UserAction;
  //     data_update: DTO_RQ_Schedule;
  //   },
  // ) {
  //   try {
  //     const result = await this.scheduleService.updateSchedule(
  //       payload.id,
  //       payload.user,
  //       payload.data_update,
  //     );
  //     return {
  //       success: true,
  //       statusCode: HttpStatus.OK,
  //       message: 'Cập nhật lịch chạy thành công',
  //       result,
  //     };
  //   } catch (error) {
  //     throw new RpcException({
  //       success: false,
  //       message: error.response?.message || 'Lỗi máy chủ dịch vụ!',
  //       statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
  //     });
  //   }
  // }
}
