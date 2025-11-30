import { Injectable } from "@nestjs/common";
import { GlobalPointMapper } from "../../mappers/global-point.mapper";
import { PointRepository } from "../../repositories/point.repository";

@Injectable()
export class GetAllGlobalPointUseCase {
    constructor(
        private readonly repo: PointRepository,
    ) {}
    async execute() {
        const entities = await this.repo.getAllGlobalPoints();
        return GlobalPointMapper.toResponseList(entities);
    }
}