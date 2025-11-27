import { Controller, Delete, Get, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
// import { BmsRouteService } from '../bms_route.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { DTO_RQ_UserAction } from 'src/utils/user.dto';
import { DTO_RQ_Route } from '../dto/bms_route.dto';
import { TokenGuard } from 'src/guards/token.guard';
import { Roles } from 'src/decorator/roles.decorator';
import { CompanyIdParam } from 'src/param/CompanyIdParam';
import { NumberIdParam } from 'src/param/NumberIdParam';
import { UUIDParam } from 'src/param/UUIDParam';
import { BmsRouteService } from '../service/bms_route.service';
import { GetRoutesNameToConfigUseCase } from '../use-cases/get-routes-name-to-config.use-case';

@Controller('bms-route-2')
@UseGuards(TokenGuard)
export class BmsRouteController {
  constructor(
    private readonly routeService: BmsRouteService,
    private readonly getRoutesNameToConfigUseCase: GetRoutesNameToConfigUseCase
  ) { }

  @Get('companies/:id/route-name-to-config-point')
  @Roles('ADMIN')
  async GetListRouteNameByCompanyId_2(@Param() param: UUIDParam) {
    return await this.getRoutesNameToConfigUseCase.execute(param.id);
  }

  // M3_v2.F1
  @Get('companies/:id/routes')
  @Roles('ADMIN')
  async GetListRouteByCompanyId(@Param() param: UUIDParam) {
    return await this.routeService.GetListRouteByCompanyId(param.id);
  }

  // M3_v2.F2
  @Post('companies/:id/routes')
  @Roles('ADMIN')
  async CreateRoute(@Param() param: UUIDParam, @Payload() data: DTO_RQ_Route) {
    return await this.routeService.CreateRoute(param.id, data);
  }

  // M3_v2.F3
  @Put(':id')
  @Roles('ADMIN')
  async UpdateRoute(
    @Param() param: UUIDParam,
    @Payload() data: DTO_RQ_Route,
  ) {
    return await this.routeService.UpdateRoute(
      param.id,
      data,
    );
  }

  // M2_v2.F4
  @Delete(':id')
  @Roles('ADMIN')
  async DeleteRoute(@Param() param: any) {
    return await this.routeService.DeleteRoute(param.id);
  }

  // M3_v2.F5
  @Put('companies/:id/routes/update-order')
  @Roles('ADMIN')
  async UpdateRouteOrder(
    @Param() param: UUIDParam,
    @Payload()
    data: {
      route_id: string;
      display_order: number;
    },
  ) {
    return await this.routeService.UpdateRouteOrder(
      data.route_id,
      data.display_order,
      param.id,
    );
  }

  // M3_v2.F6
  @Get('companies/:id/route-names')
  @Roles('ADMIN')
  async GetListRouteNameByCompanyId(@Param() param: UUIDParam) {
    return await this.routeService.GetListRouteNameByCompanyId(param.id);
  }

  // M3_v2.F7
  @Get('companies/:id/route-names-action')
  @Roles('ADMIN', 'STAFF')
  async GetListRouteNameActionByCompanyId(@Param() param: CompanyIdParam) {
    return await this.routeService.GetListRouteNameActionByCompanyId(
      param.id,
    );
  }


  // @MessagePattern({ bms: 'get_list_route_by_company' })
  // async getListRouteByCompany(@Payload() id: string) {
  //   try {
  //     const result = await this.routeService.getListRouteByCompany(id);
  //     return {
  //       success: true,
  //       statusCode: HttpStatus.OK,
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

  // @MessagePattern({ bms: 'update_route_order' })
  // async updateRouteOrder(
  //   @Payload()
  //   data: {
  //     route_id: number;
  //     display_order: number;
  //     company_id: string;
  //   },
  // ) {
  //   try {
  //     const result = await this.routeService.updateRouteOrder(
  //       data.route_id,
  //       data.display_order,
  //       data.company_id,
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
  //       message: error.response?.message || 'Service error!',
  //       statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
  //     });
  //   }
  // }

  // @MessagePattern({ bms: 'delete_route' })
  // async deleteRoute(
  //   @Payload() payload: { id: number; user: DTO_RQ_UserAction },
  // ) {
  //   try {
  //     await this.routeService.deleteRoute(payload.id, payload.user);
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

  // @MessagePattern({ bms: 'get_list_route_name_by_company' })
  // async getListRouteNameByCompany(@Payload() id: string) {
  //   try {
  //     const result = await this.routeService.getListRouteNameByCompany(id);
  //     return {
  //       success: true,
  //       statusCode: HttpStatus.OK,
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

  // BM-36 Get List Route Name Action By Company
  // @MessagePattern({ bms: 'get_list_route_name_action_by_company' })
  // async getListRouteNameActionByCompany(@Payload() id: string) {
  //   try {
  //     const result =
  //       await this.routeService.getListRouteNameActionByCompany(id);
  //     return {
  //       success: true,
  //       statusCode: HttpStatus.OK,
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

  // @MessagePattern({ bms: 'GET_LIST_ROUTE_NAME_TO_CONFIG_BY_COMPANY' })
  // async getListRouteNameToConfigByCompany(@Payload() id: string) {
  //   try {
  //     const result = await this.routeService.getListRouteNameToConfigByCompany(
  //       id,
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
  //       message: error.response?.message || 'Service error!',
  //       statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
  //     });
  //   }
  // }
}
