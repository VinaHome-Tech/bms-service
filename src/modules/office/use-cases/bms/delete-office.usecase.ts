import { Injectable } from "@nestjs/common";
import { BmsOfficeRepository } from "../../repositories/bms/bms-office.repository";

@Injectable()
export class DeleteOfficeUseCase {
    constructor(private readonly repo: BmsOfficeRepository) { }
    async execute(officeId: string) {
        return this.repo.deleteOffice(officeId);
    }
}