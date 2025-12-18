import { Injectable } from "@nestjs/common";
import { BmsOfficeRepository } from "../../repositories/bms/bms-office.repository";
import { BmsOfficeMapper } from "../../mappers/bms-office.mapper";

@Injectable()
export class GetOfficeListByCompanyIdUseCase {
    constructor(private readonly repo: BmsOfficeRepository) { }

    async execute(companyId: string) {
        const result = await this.repo.findAllByCompanyId(companyId);
        return BmsOfficeMapper.toResponseList(result);
    }
}