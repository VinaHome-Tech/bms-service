import { Injectable, NotFoundException } from "@nestjs/common";
import { RouteRepository } from "../../repositories/bms/route.repository";

@Injectable()
export class DeleteRouteUseCase {
    constructor(private readonly repo: RouteRepository) { }

    async execute(id: string) {
        // 1. Kiểm tra route có tồn tại không
        const route = await this.repo.findById(id);
        if (!route) {
            throw new NotFoundException('Tuyến không tồn tại.');
        }
        await this.repo.delete(id);
    }
}