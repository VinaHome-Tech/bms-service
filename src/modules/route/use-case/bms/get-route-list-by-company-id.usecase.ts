import { Injectable, NotFoundException } from "@nestjs/common";
import { RouteRepository } from "../../repositories/route.repository";
import { RouteMapper } from "../../mappers/bms/route.mapper";

@Injectable()
export class GetRouteListByCompanyIdUseCase {
    constructor(private readonly repo: RouteRepository) { }
    async execute(companyId: string) {
        const routes = await this.repo.findByCompanyId(companyId);
        if (!routes || routes.length === 0) {
            throw new NotFoundException('Không tìm thấy tuyến đường của công ty');
        }
        return routes.map(RouteMapper.toResponse);
    }
}