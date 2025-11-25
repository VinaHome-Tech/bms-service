import { Controller, HttpStatus } from '@nestjs/common';
import { PlatformRouteService } from './platform_route.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { DTO_RQ_RoutePoint } from './route.dto';

@Controller()
export class PlatformRouteController {
  constructor(private readonly platformRouteService: PlatformRouteService) {}

  @MessagePattern({ vht: 'GET_LIST_ROUTE_BY_COMPANY' })
  async getListRouteByCompany(@Payload() data: { companyId: string }) {
    try {
      const result = await this.platformRouteService.getListRouteByCompany(
        data.companyId,
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

  @MessagePattern({ vht: 'UPDATE_ROUTE_POINTS' })
  async updateRoutePoints(
    @Payload() data: { route_id: number; data_update: DTO_RQ_RoutePoint },
  ) {
    try {
      const result = await this.platformRouteService.updateRoutePoints(
        data.route_id,
        data.data_update,
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

  @MessagePattern({ vht: 'GET_ROUTE_POINTS' })
  async getRoutePoints(@Payload() route_id: number) {
    try {
      const result = await this.platformRouteService.getRoutePoints(route_id);
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
