import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from '../company/company.entity';
import { Repository } from 'typeorm';
import { Route } from './route.entity';
import {
  DTO_RP_ListRouteName,
  DTO_RP_Route,
  DTO_RQ_CreateRoute,
  DTO_RQ_UpdateRoute,
} from './route.dto';

@Injectable()
export class RouteService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,

    @InjectRepository(Route)
    private readonly routeRepository: Repository<Route>,
  ) {}

  async createRoute(data: DTO_RQ_CreateRoute) {
    console.log('Received data for createRoute:', data);

    const company = await this.companyRepository.findOne({
      where: { id: data.company_id },
    });

    if (!company) {
      throw new NotFoundException('Công ty không tồn tại');
    }

    const existingRoute = await this.routeRepository.findOne({
      where: {
        route_name: data.route_name,
        company: { id: data.company_id },
      },
      relations: ['company'],
    });

    if (existingRoute) {
      throw new ConflictException('Tên tuyến đã tồn tại.');
    }

    const maxOrderRoute = await this.routeRepository
      .createQueryBuilder('route')
      .where('route.company_id = :companyId', { companyId: data.company_id })
      .select('MAX(route.display_order)', 'max')
      .getRawOne();

    const maxDisplayOrder = maxOrderRoute?.max ?? 0;
    const newDisplayOrder = Number(maxDisplayOrder) + 1;

    const route = this.routeRepository.create({
      base_price: data.base_price,
      company: company,
      created_by: data.created_by,
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
      id: savedRoute.id,
      base_price: savedRoute.base_price,
      created_by: savedRoute.created_by,
      distance: savedRoute.distance,
      e_ticket_price: savedRoute.e_ticket_price,
      journey: savedRoute.journey,
      note: savedRoute.note,
      route_name: savedRoute.route_name,
      route_name_e_ticket: savedRoute.route_name_e_ticket,
      short_name: savedRoute.short_name,
      status: savedRoute.status,
      display_order: savedRoute.display_order,
      created_at: savedRoute.created_at,
    };
  }

  async getListRouteByCompany(id: number) {
    const company = await this.companyRepository.findOne({
      where: { id: id },
    });

    if (!company) {
      throw new NotFoundException('Công ty không tồn tại');
    }

    const routes = await this.routeRepository.find({
      where: { company: { id: id } },
      order: { display_order: 'ASC', created_at: 'DESC' },
    });

    return routes.map((route) => ({
      id: route.id,
      base_price: route.base_price,
      created_by: route.created_by,
      distance: route.distance,
      e_ticket_price: route.e_ticket_price,
      journey: route.journey,
      note: route.note,
      display_order: route.display_order,
      route_name: route.route_name,
      route_name_e_ticket: route.route_name_e_ticket,
      short_name: route.short_name,
      status: route.status,
      created_at: route.created_at,
    }));
  }

  async getListRouteNameByCompany(id: number): Promise<DTO_RP_ListRouteName[]> {
    const company = await this.companyRepository.findOne({
      where: { id: id },
    });

    if (!company) {
      throw new NotFoundException('Công ty không tồn tại');
    }

    const routes = await this.routeRepository.find({
      where: { company: { id: id } },
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
    data: DTO_RQ_UpdateRoute,
  ): Promise<DTO_RP_Route> {
    const route = await this.routeRepository.findOne({
      where: { id: id },
      relations: ['company'],
    });

    if (!route) {
      throw new NotFoundException('Tuyến không tồn tại');
    }

    const company = await this.companyRepository.findOne({
      where: { id: data.company_id },
    });

    if (!company) {
      throw new NotFoundException('Công ty không tồn tại');
    }

    const existingRoute = await this.routeRepository.findOne({
      where: {
        route_name: data.route_name,
        company: { id: data.company_id },
      },
      relations: ['company'],
    });
    if (existingRoute && existingRoute.id !== id) {
      throw new ConflictException('Tên tuyến đã tồn tại.');
    }
    route.base_price = data.base_price;
    route.company = company;
    route.created_by = data.created_by;
    route.distance = data.distance;
    route.e_ticket_price = data.e_ticket_price;
    route.journey = data.journey;
    route.note = data.note;
    route.route_name = data.route_name;
    route.route_name_e_ticket = data.route_name_e_ticket;
    route.short_name = data.short_name;
    route.status = data.status;
    route.created_at = new Date();
    const updatedRoute = await this.routeRepository.save(route);
    return {
      id: updatedRoute.id,
      base_price: updatedRoute.base_price,
      created_by: updatedRoute.created_by,
      distance: updatedRoute.distance,
      e_ticket_price: updatedRoute.e_ticket_price,
      journey: updatedRoute.journey,
      note: updatedRoute.note,
      display_order: updatedRoute.display_order,
      route_name: updatedRoute.route_name,
      route_name_e_ticket: updatedRoute.route_name_e_ticket,
      short_name: updatedRoute.short_name,
      status: updatedRoute.status,
      created_at: updatedRoute.created_at,
    };
  }

  async updateRouteOrder(
    id: number,
    display_order: number,
    company_id: number,
  ): Promise<DTO_RP_Route> {
    console.log('Received data for updateRouteOrder:', {
      id,
      display_order,
      company_id,
    });

    const route = await this.routeRepository.findOne({
      where: {
        id: id,
        company: { id: company_id },
      },
    });

    if (!route) {
      throw new NotFoundException(
        'Tuyến không tồn tại hoặc không thuộc công ty này',
      );
    }

    route.display_order = display_order;
    const updatedRoute = await this.routeRepository.save(route);

    return {
      id: updatedRoute.id,
      base_price: updatedRoute.base_price,
      created_by: updatedRoute.created_by,
      distance: updatedRoute.distance,
      e_ticket_price: updatedRoute.e_ticket_price,
      journey: updatedRoute.journey,
      note: updatedRoute.note,
      display_order: updatedRoute.display_order,
      route_name: updatedRoute.route_name,
      route_name_e_ticket: updatedRoute.route_name_e_ticket,
      short_name: updatedRoute.short_name,
      status: updatedRoute.status,
      created_at: updatedRoute.created_at,
    };
  }

  async deleteRoute(id: number): Promise<void> {
    const route = await this.routeRepository.findOne({
      where: { id: id },
      relations: ['company'],
    });

    if (!route) {
      throw new NotFoundException('Tuyến không tồn tại');
    }

    await this.routeRepository.remove(route);
  }
}
