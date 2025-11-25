import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { BmsOfficeService } from './bms_office.service';
import { DTO_RQ_Office } from './bms_office.dto';
import { DTO_RQ_UserAction } from 'src/utils/user.dto';
import { Roles } from 'src/decorator/roles.decorator';
import { TokenGuard } from 'src/guards/token.guard';
import { CompanyIdParam } from 'src/param/CompanyIdParam';
import { NumberIdParam } from 'src/param/NumberIdParam';

@Controller('bms-office')
@UseGuards(TokenGuard)
export class BmsOfficeController {
  constructor(private readonly service: BmsOfficeService) {}

  // M1_v2.F1
  @Get('companies/:id/room-work')
  @Roles('ADMIN', 'STAFF')
  async GetListOfficeRoomWorkByCompanyId(@Param() param: CompanyIdParam) {
    return await this.service.GetListOfficeRoomWorkByCompanyId(param.id);
  }

  // M1_v2.F2
  @Get('companies/:id/offices')
  @Roles('ADMIN')
  async GetListOfficeByCompanyId(@Param() param: CompanyIdParam) {
    return await this.service.GetListOfficeByCompanyId(param.id);
  }

  // M1_v2.F3
  @Post('companies/:id/offices')
  @Roles('ADMIN')
  async CreateOffice(@Param() param: CompanyIdParam, @Body() body: DTO_RQ_Office) {
    return await this.service.CreateOffice(param.id, body);
  }

  // M1_v2.F4
  @Put(':id')
  @Roles('ADMIN')
  async UpdateOffice(@Param() param: any, @Body() body: DTO_RQ_Office) {
    return await this.service.UpdateOffice(param.id, body);
  }
  
  // M1_v2.F5
  @Delete(':id')
  @Roles('ADMIN')
  async DeleteOffice(@Param() param: any) {
    return await this.service.DeleteOffice(param.id);
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

  // @MessagePattern({ bms: 'delete_office' })
  // async deleteOffice(
  //   @Payload() payload: { id: number; user: DTO_RQ_UserAction },
  // ) {
  //   try {
  //     await this.service.deleteOffice(payload.id, payload.user);
  //     return {
  //       success: true,
  //       statusCode: HttpStatus.OK,
  //       message: 'Success',
  //     };
  //   } catch (error) {
  //     throw new RpcException({
  //       success: false,
  //       message: error.response?.message || 'Service error!',
  //       statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
  //     });
  //   }
  // }

  // @MessagePattern({ bms: 'update_office' })
  // async updateOffice(
  //   @Payload()
  //   payload: {
  //     id: number;
  //     user: DTO_RQ_UserAction;
  //     data_update: DTO_RQ_Office;
  //   },
  // ) {
  //   try {
  //     const result = await this.service.updateOffice(
  //       payload.id,
  //       payload.user,
  //       payload.data_update,
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

  // @MessagePattern({ bms: 'get_list_office_by_company' })
  // async getListOfficeByCompany(@Payload() id: string) {
  //   try {
  //     const result = await this.service.getListOfficeByCompany(id);
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

  // @MessagePattern({ bms: 'get_list_office_name_by_company' })
  // async getListOfficeNameByCompany(@Payload() id: number) {
  //   try {
  //     const result = await this.service.getListOfficeNameByCompany(id);
  //     return {
  //       success: true,
  //       statusCode: HttpStatus.OK,
  //       message: 'Lấy danh sách tên văn phòng thành công',
  //       result,
  //     };
  //   } catch (error) {
  //     throw new RpcException({
  //       success: false,
  //       message:
  //         error.response?.message || error.message || 'Lỗi máy chủ dịch vụ!',
  //       statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
  //     });
  //   }
  // }

  // BM-33 Get List Office Room Work By Company
  // @MessagePattern({ bms: 'get_list_office_room_work_by_company' })
  // async getListOfficeRoomWorkByCompany(@Payload() id: string) {
  //   try {
  //     const result =
  //       await this.service.getListOfficeRoomWorkByCompany(id);
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
}
