import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from '../company/company.entity';
import { Repository } from 'typeorm';
import { Route } from './route.entity';
import { DTO_RP_ListRouteName, DTO_RP_Route, DTO_RQ_Route } from './route.dto';
import { DTO_RQ_UserAction } from 'src/utils/user.dto';
import { RouteMapper } from './route.mapper';

@Injectable()
export class RouteService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,

    @InjectRepository(Route)
    private readonly routeRepository: Repository<Route>,
  ) {}

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

  async getListRouteNameByCompany(id: number): Promise<DTO_RP_ListRouteName[]> {
    const company = await this.companyRepository.findOne({
      where: { id: id },
    });

    if (!company) {
      throw new NotFoundException('Công ty không tồn tại');
    }

    const routes = await this.routeRepository.find({
      // where: { company: { id: id } },
      select: ['id', 'route_name'],
      order: { display_order: 'ASC', created_at: 'DESC' },
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

  async getListRouteNameActionByCompany(
    id: number,
  ): Promise<DTO_RP_ListRouteName[]> {
    const company = await this.companyRepository.findOne({
      where: { id: id },
    });

    if (!company) {
      throw new NotFoundException('Công ty không tồn tại');
    }

    const routes = await this.routeRepository.find({
      where: {
        // company: { id: id },
        status: true,
      },
      select: ['id', 'route_name'],
      order: { display_order: 'ASC', created_at: 'DESC' },
    });

    return routes.map((route) => ({
      id: route.id,
      route_name: route.route_name,
    }));
  }
}
