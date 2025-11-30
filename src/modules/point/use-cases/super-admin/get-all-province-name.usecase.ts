import { Injectable } from "@nestjs/common";
import { PointRepository } from "../../repositories/point.repository";
import { ProvinceMapper } from "../../mappers/province.mapper";

@Injectable()
export class GetAllProvinceNameUseCase {
    constructor(
       private readonly repo: PointRepository,
    ) { }

    async execute() {
        const provinces = await this.repo.getAllProvinceName();
        return ProvinceMapper.toResponseList(provinces);
    }
}