import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { BmsOfficeService } from './bms_office.service';
import { DTO_RQ_Office } from './bms_office.dto';
import { DTO_RQ_UserAction } from 'src/utils/user.dto';

@Controller()
export class BmsOfficeController {
  constructor(private readonly service: BmsOfficeService) {}

  // M1_v2.F1
  @MessagePattern({ bms: 'get_list_office_room_work_by_company_id' })
  async GetListOfficeRoomWorkByCompanyId(@Payload() id: string) {
    try {
      const result =
        await this.service.GetListOfficeRoomWorkByCompanyId(id);
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

  // M1_v2.F2
  @MessagePattern({ bms: 'get_list_office_by_company_id' })
  async GetListOfficeByCompanyId(@Payload() id: string) {
    try {
      const result = await this.service.GetListOfficeByCompanyId(id);
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

  // M1_v2.F3
  @MessagePattern({ bms: 'create_office' })
  async CreateOffice(@Payload() payload: { id: string; data: DTO_RQ_Office }) {
    try {
      const result = await this.service.CreateOffice(payload.id, payload.data);
      return {
        success: true,
        statusCode: HttpStatus.CREATED,
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

  // M1_v2.F4
  // @MessagePattern({ bms: 'update_office_by_id' })
  // async UpdateOffice(
  //   @Payload() payload: { id: number; data: DTO_RQ_Office },
  // ) {
  //   try {
  //     const result = await this.service.UpdateOffice(
  //       payload.id,
  //       payload.data,
  //     );
  //     return {
  //       success: true,
  //       statusCode: HttpStatus.OK,
  //       message: 'Success',
  //       result,
  //     };
  //   } catch (error) {
  //     throw new RpcException({
  //       success: false,
  //       message: error.response?.message || error.message || 'Service error!',
  //       statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
  //     });
  //   }
  // }

  @MessagePattern({ bms: 'get_office_info' })
  getOffice() {
    return {
      success: true,
      statusCode: 200,
      message: 'Office service is running',
    };
  }

  // @MessagePattern({ bms: 'create_office' })
  // async createOffice(
  //   @Payload()
  //   payload: {
  //     user: DTO_RQ_UserAction;
  //     data_create: DTO_RQ_Office;
  //   },
  // ) {
  //   try {
  //     const result = await this.service.createOffice(
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

  @MessagePattern({ bms: 'delete_office' })
  async deleteOffice(
    @Payload() payload: { id: number; user: DTO_RQ_UserAction },
  ) {
    try {
      await this.service.deleteOffice(payload.id, payload.user);
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
      const result = await this.service.updateOffice(
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
      const result = await this.service.getListOfficeByCompany(id);
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
      const result = await this.service.getListOfficeNameByCompany(id);
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

  // BM-33 Get List Office Room Work By Company
  @MessagePattern({ bms: 'get_list_office_room_work_by_company' })
  async getListOfficeRoomWorkByCompany(@Payload() id: string) {
    try {
      const result =
        await this.service.getListOfficeRoomWorkByCompany(id);
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
