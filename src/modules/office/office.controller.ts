import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { OfficeService } from './office.service';
import { DTO_RQ_Office } from './office.dto';
import { DTO_RQ_UserAction } from 'src/utils/user.dto';

@Controller()
export class OfficeController {
  constructor(private readonly officeService: OfficeService) {}
  @MessagePattern({ bms: 'get_office_info' })
  getOffice() {
    return {
      success: true,
      statusCode: 200,
      message: 'Office service is running',
    };
  }

  @MessagePattern({ bms: 'create_office' })
  async createOffice(
    @Payload()
    payload: {
      user: DTO_RQ_UserAction;
      data_create: DTO_RQ_Office;
    },
  ) {
    try {
      const result = await this.officeService.createOffice(
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

  @MessagePattern({ bms: 'delete_office' })
  async deleteOffice(
    @Payload() payload: { id: number; user: DTO_RQ_UserAction },
  ) {
    try {
      await this.officeService.deleteOffice(payload.id, payload.user);
      return {
        success: true,
        statusCode: HttpStatus.OK,
        message: 'Success',
      };
    } catch (error) {
      throw new RpcException({
        success: false,
        message: error.response?.message || 'Service error!',
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @MessagePattern({ bms: 'update_office' })
  async updateOffice(
    @Payload()
    payload: {
      id: number;
      user: DTO_RQ_UserAction;
      data_update: DTO_RQ_Office;
    },
  ) {
    try {
      const result = await this.officeService.updateOffice(
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
        message: error.response?.message || error.message || 'Service error!',
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @MessagePattern({ bms: 'get_list_office_by_company' })
  async getListOfficeByCompany(@Payload() id: string) {
    try {
      const result = await this.officeService.getListOfficeByCompany(id);
      return {
        success: true,
        statusCode: HttpStatus.OK,
        message: 'Success',
        result,
      };
    } catch (error) {
      throw new RpcException({
        success: false,
        message: error.response?.message || error.message || 'Service error!',
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @MessagePattern({ bms: 'get_list_office_name_by_company' })
  async getListOfficeNameByCompany(@Payload() id: number) {
    try {
      const result = await this.officeService.getListOfficeNameByCompany(id);
      return {
        success: true,
        statusCode: HttpStatus.OK,
        message: 'Lấy danh sách tên văn phòng thành công',
        result,
      };
    } catch (error) {
      throw new RpcException({
        success: false,
        message:
          error.response?.message || error.message || 'Lỗi máy chủ dịch vụ!',
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @MessagePattern({ bms: 'get_list_office_room_work_by_company' })
  async getListOfficeRoomWorkByCompany(@Payload() id: string) {
    try {
      const result =
        await this.officeService.getListOfficeRoomWorkByCompany(id);
      return {
        success: true,
        statusCode: HttpStatus.OK,
        message: 'Success',
        result,
      };
    } catch (error) {
      throw new RpcException({
        success: false,
        message: error.response?.message || error.message || 'Service error!',
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
