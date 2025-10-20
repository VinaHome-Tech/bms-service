/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, HttpStatus } from '@nestjs/common';
import { BmsPointService } from './bms_point.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { DTO_RQ_ItemPointConfigTime } from './bms_point.dto';

@Controller()
export class BmsPointController {
  constructor(private readonly bmsPointService: BmsPointService) {}

  @MessagePattern({ bms: 'GET_LIST_ROUTE_POINT_NAME_BY_ROUTE' })
  async getListRoutePointNameByRoute(@Payload() data: number) {
    try {
      const result =
        await this.bmsPointService.getListRoutePointNameByRoute(data);
      return {
        success: true,
        statusCode: HttpStatus.OK,
        message: 'Success',
        result,
      };
    } catch (error) {
      throw new RpcException({
        success: false,
        message: error.response?.message || 'Service error',
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @MessagePattern({ bms: 'GET_LIST_POINT_NAME_BY_ROUTE' })
  async getListPointNameByRoute(@Payload() data: number) {
    try {
      const result = await this.bmsPointService.getListPointNameByRoute(data);
      return {
        success: true,
        statusCode: HttpStatus.OK,
        message: 'Success',
        result,
      };
    } catch (error) {
      throw new RpcException({
        success: false,
        message: error.response?.message || 'Service error',
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
  @MessagePattern({ bms: 'GET_LIST_POINT_TO_CONFIG_TIME_BY_ROUTE' })
  async getListPointToConfigTimeByRoute(@Payload() data: number) {
    try {
      const result =
        await this.bmsPointService.getListPointToConfigTimeByRoute(data);
      return {
        success: true,
        statusCode: HttpStatus.OK,
        message: 'Success',
        result,
      };
    } catch (error) {
      throw new RpcException({
        success: false,
        message: error.response?.message || 'Service error',
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
  @MessagePattern({ bms: 'UPDATE_POINT_CONFIG_TIME_BY_ROUTE' })
  async updatePointConfigTimeByRoute(
    @Payload()
    payload: {
      route_id: number;
      data:
        | DTO_RQ_ItemPointConfigTime[]
        | { data: DTO_RQ_ItemPointConfigTime[] };
    },
  ) {
    try {
      console.log('📩 [Payload nhận được]:', JSON.stringify(payload, null, 2));

      // ✅ Giải nén an toàn dữ liệu (tránh lỗi bị bọc 2 lớp)
      const extractedData = Array.isArray(payload.data)
        ? payload.data
        : payload.data?.data;

      if (!Array.isArray(extractedData)) {
        console.log(
          '❌ Dữ liệu gửi sang không đúng định dạng mảng:',
          extractedData,
        );
        throw new RpcException({
          success: false,
          message: 'Invalid data format',
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }

      const result = await this.bmsPointService.updatePointConfigTimeByRoute(
        payload.route_id,
        extractedData,
      );

      return {
        success: true,
        statusCode: HttpStatus.OK,
        message: 'Success',
        result,
      };
    } catch (error) {
      console.error('🔥 Lỗi khi cập nhật cấu hình thời gian:', error);
      throw new RpcException({
        success: false,
        message: 'Service error',
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
