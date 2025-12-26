import { Injectable, NotFoundException } from "@nestjs/common";
import { SuperAdminRouteRepository } from "../../repositories/super-admin/super-admin-route.repository";

@Injectable()
export class SuperAdminDeleteRouteUseCase {
    constructor(private readonly repo: SuperAdminRouteRepository) { }
    async execute(id: string) {
        // 1. Kiểm tra route có tồn tại không
        const route = await this.repo.findById(id);
        if (!route) {
            throw new NotFoundException('Tuyến không tồn tại.');
        }
        await this.repo.delete(id);
    }
}