import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  DTO_RP_ListRouteName,
  DTO_RP_ListRouteNameToConfig,

} from './route.dto';
import { DTO_RQ_UserAction } from 'src/utils/user.dto';
import { RouteMapper } from './route.mapper';
import { Route } from 'src/entities/route.entity';
// import { RoutePoint } from 'src/entities/route_point.entity';
import { DTO_RP_Route, DTO_RQ_Route } from './bms_route.dto';

@Injectable()
export class BmsRouteService {
  constructor(
    @InjectRepository(Route)
    private readonly routeRepository: Repository<Route>,
    // @InjectRepository(RoutePoint)
    // private readonly routePointRepository: Repository<RoutePoint>,
  ) { }


  // M3_v2.F1
  async GetListRouteByCompanyId(id: string) {
    try {
      console.time('GetListRouteByCompanyId');
      const routes = await this.routeRepository.find({
        where: { company_id: id },
        select: {
          id: true,
          base_price: true,
          distance: true,
          e_ticket_price: true,
          journey: true,
          note: true,
          route_name: true,
          route_name_e_ticket: true,
          short_name: true,
          status: true,
          display_order: true,
        },
        order: { display_order: 'ASC' },
      });
      if (!routes.length) {
        throw new NotFoundException('Không có tuyến nào cho công ty này');
      }
      return {
        success: true,
        message: 'Success',
        statusCode: HttpStatus.OK,
        result: routes,
      }
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new InternalServerErrorException('Lấy danh sách tuyến thất bại');
    } finally {
      console.timeEnd('GetListRouteByCompanyId');
    }
  }

  // M3_v2.F2
  async CreateRoute(
    id: string,
    data: DTO_RQ_Route,
  ) {
    try {
      console.time('CreateRoute');
      const existingRoute = await this.routeRepository.findOne({
        where: {
          route_name: data.route_name,
          company_id: id,
        },
      });
      if (existingRoute) {
        throw new ConflictException('Tên tuyến đã tồn tại.');
      }
      const maxOrderRoute = await this.routeRepository
        .createQueryBuilder('route')
        .where('route.company_id = :companyId', { companyId: id })
        .select('MAX(route.display_order)', 'max')
        .getRawOne();
      const maxDisplayOrder = maxOrderRoute?.max ?? 0;
      const newDisplayOrder = Number(maxDisplayOrder) + 1;
      const route = this.routeRepository.create({
        base_price: data.base_price,
        company_id: id,
        distance: data.distance,
        e_ticket_price: data.e_ticket_price,
        journey: data.journey,
        note: data.note,
        route_name: data.route_name,
        route_name_e_ticket: data.route_name_e_ticket,
        short_name: data.short_name,
        status: data.status,
        display_order: newDisplayOrder,
      });
      const savedRoute = await this.routeRepository.save(route);
      return {
        success: true,
        message: 'Success',
        statusCode: HttpStatus.CREATED,
        result: savedRoute,
      }
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error('Error deleting office:', error);
      throw new InternalServerErrorException('Thêm tuyến thất bại');
    } finally {
      console.timeEnd('CreateRoute');
    }
  }

  // M3_v2.F3
  async UpdateRoute(
    id: number,
    data: DTO_RQ_Route,
  ) {
    try {
      console.time('UpdateRoute');
      const route = await this.routeRepository.findOne({
        where: { id: id },
      });
      if (!route) {
        throw new NotFoundException('Tuyến không tồn tại');
      }
      const existingRoute = await this.routeRepository.findOne({
        where: {
          route_name: data.route_name,
          company_id: route.company_id,
        },
      });
      if (existingRoute && existingRoute.id !== id) {
        throw new ConflictException('Tên tuyến đã tồn tại.');
      }
      Object.assign(route, data);
      const updatedRoute = await this.routeRepository.save(route);
      return {
        success: true,
        message: 'Success',
        statusCode: HttpStatus.OK,
        result: updatedRoute,
      }
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error('Error updating route:', error);
      throw new InternalServerErrorException('Cập nhật tuyến thất bại');
    } finally {
      console.timeEnd('UpdateRoute');
    }
  }

  // M3_v2.F4
  async DeleteRoute(
    id: number,
  ) {
    try {
      console.time('DeleteRoute');
      const route = await this.routeRepository.findOne({
        where: { id: id },
      });
      if (!route) {
        throw new NotFoundException('Tuyến không tồn tại');
      }
      await this.routeRepository.remove(route);
      return {
        success: true,
        message: 'Success',
        statusCode: HttpStatus.OK,
      }
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error('Error deleting route:', error);
      throw new InternalServerErrorException('Xoá tuyến thất bại');
    } finally {
      console.timeEnd('DeleteRoute');
    }
  }

  // M3_v2.F5
  async UpdateRouteOrder(
    route_id: number,
    display_order: number,
    id: string,
  ) {
    try {
      console.time('UpdateRouteOrder');
      const route = await this.routeRepository.findOne({
        where: {
          id: route_id,
          company_id: id,
        },
      });
      if (!route) {
        throw new NotFoundException(
          'Dữ liệu tuyến không tồn tại',
        );
      }
      route.display_order = display_order;
      const updatedRoute = await this.routeRepository.save(route);
      return {
        success: true,
        message: 'Success',
        statusCode: HttpStatus.OK,
        result: updatedRoute,
      }
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error('Error updating route order:', error);
      throw new InternalServerErrorException('Cập nhật thứ tự tuyến thất bại');
    } finally {
      console.timeEnd('UpdateRouteOrder');
    }
  }

  // M3_v2.F6
  async GetListRouteNameByCompanyId(
    id: string,
  ) {
    try {
      console.time('GetListRouteNameByCompanyId');
      const routes = await this.routeRepository.find({
        where: { company_id: id },
        select: {
          id: true,
          route_name: true,
        },
        order: { display_order: 'ASC' },
      });
      if (!routes.length) {
        throw new NotFoundException('Không có tuyến nào cho công ty này');
      }
      return {
        success: true,
        message: 'Success',
        statusCode: HttpStatus.OK,
        result: routes,
      }
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new InternalServerErrorException('Lấy danh sách tên tuyến thất bại');
    } finally {
      console.timeEnd('GetListRouteNameByCompanyId');
    }
  }

  // M3_v2.F7
  async GetListRouteNameActionByCompanyId(
    id: string,
  ) {
    try {
      console.time('GetListRouteNameActionByCompanyId');
      const routes = await this.routeRepository.find({
        where: {
          company_id: id,
          status: true,
        },
        select: {
          id: true,
          route_name: true,
        },
        order: { display_order: 'ASC' },
      });
      if (!routes.length) {
        throw new NotFoundException('Không có tuyến nào cho công ty này');
      }
      return {
        success: true,
        message: 'Success',
        statusCode: HttpStatus.OK,
        result: routes,
      }
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new InternalServerErrorException('Lấy danh sách tên tuyến thất bại');
    } finally {
      console.timeEnd('GetListRouteNameActionByCompanyId');
    }
  }




  // async getListRouteNameToConfigByCompany(
  //   id: string,
  // ): Promise<DTO_RP_ListRouteNameToConfig[]> {
  //   console.time('⏱ getListRouteNameToConfigByCompany');
  //   try {
  //     const routes = await this.routeRepository.find({
  //       where: { company_id: id, status: true },
  //       relations: [ 'routePoints' ],
  //       select: {
  //         id: true,
  //         route_name: true,
  //         base_price: true,
  //         routePoints: { id: true },
  //       },
  //       order: { display_order: 'ASC' },
  //     });
  //     if (!routes.length) {
  //       console.timeEnd('⏱ getListRouteNameToConfigByCompany');
  //       return [];
  //     }
  //     console.timeEnd('⏱ getListRouteNameToConfigByCompany');
  //     return routes.map((route) => ({
  //       id: route.id,
  //       route_name: route.route_name,
  //       display_price: route.base_price,
  //       point_length: route.routePoints.length,
  //     }));
  //   } catch (error) {
  //     console.timeEnd('⏱ getListRouteNameToConfigByCompany');
  //     throw error;
  //   }
  // }


  async createRoute(
    user: DTO_RQ_UserAction,
    data_create: DTO_RQ_Route,
  ): Promise<DTO_RP_Route> {
    console.log('User:', user);
    console.log('Data Create:', data_create);

    const existingRoute = await this.routeRepository.findOne({
      where: {
        route_name: data_create.route_name,
        company_id: user.company_id,
      },
    });

    if (existingRoute) {
      throw new ConflictException('Tên tuyến đã tồn tại.');
    }

    const maxOrderRoute = await this.routeRepository
      .createQueryBuilder('route')
      .where('route.company_id = :companyId', { companyId: user.company_id })
      .select('MAX(route.display_order)', 'max')
      .getRawOne();

    const maxDisplayOrder = maxOrderRoute?.max ?? 0;
    const newDisplayOrder = Number(maxDisplayOrder) + 1;

    const route = this.routeRepository.create({
      base_price: data_create.base_price,
      company_id: user.company_id,
      distance: data_create.distance,
      e_ticket_price: data_create.e_ticket_price,
      journey: data_create.journey,
      note: data_create.note,
      route_name: data_create.route_name,
      route_name_e_ticket: data_create.route_name_e_ticket,
      short_name: data_create.short_name,
      status: data_create.status,
      display_order: newDisplayOrder,
    });

    const savedRoute = await this.routeRepository.save(route);

    return RouteMapper.toDTO(savedRoute);
  }

  async getListRouteByCompany(id: string) {
    console.log('Received company ID:', id);
    const routes = await this.routeRepository.find({
      where: { company_id: id },
      order: { display_order: 'ASC' },
    });

    return routes.map((route) => RouteMapper.toDTO(route));
  }

  async getListRouteNameByCompany(id: string): Promise<DTO_RP_ListRouteName[]> {
    const routes = await this.routeRepository.find({
      where: { company_id: id },
      select: [ 'id', 'route_name' ],
      order: { display_order: 'ASC' },
    });

    return routes.map((route) => ({
      id: route.id,
      route_name: route.route_name,
    }));
  }

  async updateRoute(
    id: number,
    user: DTO_RQ_UserAction,
    data_update: DTO_RQ_Route,
  ): Promise<DTO_RP_Route> {
    const route = await this.routeRepository.findOne({
      where: { id: id },
    });

    if (!route) {
      throw new NotFoundException('Tuyến không tồn tại');
    }

    const existingRoute = await this.routeRepository.findOne({
      where: {
        route_name: data_update.route_name,
        company_id: user.company_id,
      },
    });
    if (existingRoute && existingRoute.id !== id) {
      throw new ConflictException('Tên tuyến đã tồn tại.');
    }
    Object.assign(existingRoute, data_update);
    const updatedRoute = await this.routeRepository.save(existingRoute);
    return RouteMapper.toDTO(updatedRoute);
  }

  async updateRouteOrder(
    id: number,
    display_order: number,
    company_id: string,
  ): Promise<DTO_RP_Route> {
    console.log('Received data for updateRouteOrder:', {
      id,
      display_order,
      company_id,
    });

    const route = await this.routeRepository.findOne({
      where: {
        id: id,
        company_id: company_id,
      },
    });

    if (!route) {
      throw new NotFoundException(
        'Tuyến không tồn tại hoặc không thuộc công ty này',
      );
    }

    route.display_order = display_order;
    const updatedRoute = await this.routeRepository.save(route);

    return RouteMapper.toDTO(updatedRoute);
  }

  async deleteRoute(id: number, user: DTO_RQ_UserAction): Promise<void> {
    console.log('Delete Route ID:', id);
    console.log('User:', user);
    const route = await this.routeRepository.findOne({
      where: { id: id },
    });

    if (!route) {
      throw new NotFoundException('Tuyến không tồn tại');
    }

    await this.routeRepository.remove(route);
  }

  // BM-36 Get List Route Name Action By Company
  async getListRouteNameActionByCompany(
    id: string,
  ): Promise<DTO_RP_ListRouteName[]> {
    try {
      const routes = await this.routeRepository.find({
        where: {
          company_id: id,
          status: true,
        },
        select: {
          id: true,
          route_name: true,
        },
        order: { display_order: 'ASC' },
      });
      return routes;
    } catch (error) {
      throw error;
    }
  }


}
