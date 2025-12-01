import { Injectable, NotFoundException } from "@nestjs/common";
import { SuperAdminRouteRepository } from "../../repositories/super-admin-route.repository";
import { SuperAdminRouteMapper } from "../../mappers/super-admin-route.mapper";

@Injectable()
export class SuperAdminGetAllRouteByCompanyUseCase {
    constructor(private readonly repo: SuperAdminRouteRepository) { }
    async execute(companyId: string) {
        const routes = await this.repo.findByCompanyId(companyId);
        if (!routes || routes.length === 0) {
            throw new NotFoundException('Không tìm thấy tuyến đường của công ty');
        }
        return SuperAdminRouteMapper.toResponseList(routes);
    }
}