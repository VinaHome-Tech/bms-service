import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RouteRepository } from "./route.repository";
import { RouteOrmEntity } from "../entities/RouteOrmEntity.entity";
import { Repository } from "typeorm";

@Injectable()
export class TypeOrmRouteRepository extends RouteRepository {
  constructor(
    @InjectRepository(RouteOrmEntity)
    private readonly repo: Repository<RouteOrmEntity>,
  ) {
    super();
  }

  async findNameByCompanyId(companyId: string): Promise<RouteOrmEntity[]> {
    return this.repo.find({
      where: { company_id: companyId },
      select: ['id', 'route_name', 'display_order'],
      order: { display_order: 'ASC' },
    });
  }
  async findNameActionByCompanyId(companyId: string): Promise<RouteOrmEntity[]> {
    return this.repo.find({
      where: { company_id: companyId, status: true },
      select: ['id', 'route_name', 'display_order'],
      order: { display_order: 'ASC' },
    });
  }
  async findByCompanyId(companyId: string): Promise<RouteOrmEntity[]> {
    return this.repo.find({
      where: { company_id: companyId },
      select: [
        'id',
        'display_order',
        'distance',
        'e_ticket_price',
        'journey',
        'note',
        'route_name',
        'route_name_e_ticket',
        'short_name',
        'status',
        'base_price',
      ],
      order: { display_order: 'ASC' },
    });
  }

  findOneByCompanyAndRouteName(companyId: string, routeName: string) {
    return this.repo.findOne({ where: { company_id: companyId, route_name: routeName } });
  }

  findOneByCompanyAndShortName(companyId: string, shortName: string) {
    return this.repo.findOne({ where: { company_id: companyId, short_name: shortName } });
  }

  findOneByCompanyAndETicketName(companyId: string, eticketName: string) {
    return this.repo.findOne({ where: { company_id: companyId, route_name_e_ticket: eticketName } });
  }

  async getMaxDisplayOrder(companyId: string): Promise<number> {
    const result = await this.repo
      .createQueryBuilder('r')
      .where('r.company_id = :companyId', { companyId })
      .select('MAX(r.display_order)', 'max')
      .getRawOne();

    return Number(result?.max ?? 0);
  }

  async createRoute(companyId: string, data: Partial<RouteOrmEntity>) {
    const newRoute = this.repo.create({
      ...data,
      company_id: companyId,
    });

    return this.repo.save(newRoute);
  }

  async findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async findByCompanyAndRouteName(companyId: string, routeName: string) {
    return this.repo.findOne({ where: { company_id: companyId, route_name: routeName } });
  }

  async findByCompanyAndShortName(companyId: string, shortName: string) {
    return this.repo.findOne({ where: { company_id: companyId, short_name: shortName } });
  }

  async findByCompanyAndETicketName(companyId: string, eticketName: string) {
    return this.repo.findOne({ where: { company_id: companyId, route_name_e_ticket: eticketName } });
  }

  async updateRoute(route: RouteOrmEntity): Promise<RouteOrmEntity> {
    return this.repo.save(route);
  }
  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

}