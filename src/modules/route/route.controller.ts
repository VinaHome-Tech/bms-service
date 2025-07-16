import { Controller, HttpStatus } from '@nestjs/common';
import { RouteService } from './route.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { DTO_RQ_CreateRoute, DTO_RQ_UpdateRoute } from './route.dto';

@Controller()
export class RouteController {
  constructor(private readonly routeService: RouteService) {}

  @MessagePattern({ bms: 'create_route' })
  async createRoute(@Payload() data: DTO_RQ_CreateRoute) {
    try {
      const result = await this.routeService.createRoute(data);
      return {
        success: true,
        statusCode: HttpStatus.CREATED,
        message: 'Tạo tuyến thành công',
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

  @MessagePattern({ bms: 'update_route' })
  async updateRoute(
    @Payload() payload: { id: number; data: DTO_RQ_UpdateRoute },
  ) {
    try {
      const result = await this.routeService.updateRoute(
        payload.id,
        payload.data,
      );
      return {
        success: true,
        statusCode: HttpStatus.OK,
        message: 'Cập nhật tuyến thành công',
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

  @MessagePattern({ bms: 'get_list_route_by_company' })
  async getListRouteByCompany(@Payload() id: number) {
    try {
      const result = await this.routeService.getListRouteByCompany(id);
      return {
        success: true,
        statusCode: HttpStatus.OK,
        message: 'Lấy danh sách tuyến thành công',
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

  @MessagePattern({ bms: 'update_route_order' })
  async updateRouteOrder(
    @Payload()
    data: {
      route_id: number;
      display_order: number;
      company_id: number;
    },
  ) {
    try {
      const result = await this.routeService.updateRouteOrder(
        data.route_id,
        data.display_order,
        data.company_id,
      );
      return {
        success: true,
        statusCode: HttpStatus.OK,
        message: 'Cập nhật thứ tự tuyến thành công',
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

  @MessagePattern({ bms: 'delete_route' })
  async deleteRoute(@Payload() id: number) {
    try {
      await this.routeService.deleteRoute(id);
      return {
        success: true,
        statusCode: HttpStatus.OK,
        message: 'Xóa tuyến thành công',
      };
    } catch (error) {
      throw new RpcException({
        success: false,
        message: error.response?.message || 'Lỗi máy chủ dịch vụ!',
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @MessagePattern({ bms: 'get_list_route_name_by_company' })
  async getListRouteNameByCompany(@Payload() id: number) {
    try {
      const result = await this.routeService.getListRouteNameByCompany(id);
      return {
        success: true,
        statusCode: HttpStatus.OK,
        message: 'Lấy danh sách tên tuyến thành công',
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

  @MessagePattern({ bms: 'get_list_route_name_action_by_company' })
  async getListRouteNameActionByCompany(@Payload() id: number) {
    try {
      const result =
        await this.routeService.getListRouteNameActionByCompany(id);
      return {
        success: true,
        statusCode: HttpStatus.OK,
        message: 'Lấy danh sách tên tuyến hành động thành công',
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
