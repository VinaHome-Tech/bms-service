import { Injectable, NotFoundException } from "@nestjs/common";
import { RouteRepository } from "../../repositories/bms/route.repository";
import { RouteMapper } from "../../mappers/bms/route.mapper";
import { BmsRouteMapper } from "../../mappers/bms-route.mapper";

@Injectable()
export class GetRouteListByCompanyIdUseCase {
    constructor(private readonly repo: RouteRepository) { }
    async execute(companyId: string) {
        const routes = await this.repo.findAllByCompanyId(companyId);
        if (!routes || routes.length === 0) {
            throw new NotFoundException('Không tìm thấy tuyến đường của công ty');
        }
        return BmsRouteMapper.toResponseList(routes);
    }
}