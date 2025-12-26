import { Injectable, NotFoundException } from "@nestjs/common";
import { RouteRepository } from "../../repositories/bms/route.repository";
import { RouteNameToConfigMapper } from "../../mappers/bms/route-name-to-config.mapper";

@Injectable()
export class GetListRouteNameToConfigUseCase {
    constructor(private readonly repo: RouteRepository) { }
    async execute(companyId: string) {
        const routes = await this.repo.findAllByCompanyId(companyId);  
        if (!routes || routes.length === 0) {
            throw new NotFoundException('Không tìm thấy tuyến đường của công ty');
        }
        return routes.map(RouteNameToConfigMapper.toResponse);
    }
}