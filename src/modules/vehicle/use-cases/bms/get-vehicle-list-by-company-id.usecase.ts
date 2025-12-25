import { Injectable } from "@nestjs/common";
import { BmsVehicleRepository } from "../../repositories/bms/bms-vehicle.repository";
import { BmsVehicleMapper } from "../../mappers/bms-vehicle.mapper";

@Injectable()
export class GetVehicleListByCompanyIdUseCase {
    constructor(private readonly repo: BmsVehicleRepository) { }
    async execute(companyId: string) {
        const result = await this.repo.findAllByCompanyId(companyId);
        return BmsVehicleMapper.toResponseList(result);
    }
}