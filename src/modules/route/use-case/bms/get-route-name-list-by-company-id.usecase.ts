import { InjectRepository } from "@nestjs/typeorm";
import { RouteOrmEntity } from "../../entities/RouteOrmEntity";
import { Injectable, NotFoundException } from "@nestjs/common";
import { RouteRepository } from "../../repositories/bms/route.repository";
import { RouteNameMapper } from "../../mappers/bms/route-name.mapper";

@Injectable()
export class GetRouteNameListByCompanyIdUseCase {
  constructor(private readonly repo: RouteRepository) {}

  async execute(companyId: string) {
    const routes = await this.repo.findNameByCompanyId(companyId);

    if (!routes || routes.length === 0) {
      throw new NotFoundException('Không tìm thấy tuyến đường của công ty');
    }

    return routes.map(RouteNameMapper.toResponse);
  }
}
