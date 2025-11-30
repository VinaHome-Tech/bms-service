import { Injectable } from "@nestjs/common";
import { PointRepository } from "../../repositories/point.repository";
import { WardMapper } from "../../mappers/ward.mapper";

@Injectable()
export class GetWardsByProvinceCodeUseCase {
    constructor(private readonly pointRepository: PointRepository) {}

    async execute(provinceCode: string) {
        const wards = await this.pointRepository.getWardsByProvinceCode(provinceCode);
        return WardMapper.toResponseList(wards);
    }
}