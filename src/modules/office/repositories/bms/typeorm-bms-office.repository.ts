import { Injectable } from "@nestjs/common";
import { BmsOfficeRepository } from "./bms-office.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { OfficeOrmEntity } from "../../entities/OfficeOrmEntity";
import { Repository } from "typeorm";
import { OfficePhoneOrmEntity } from "../../entities/OfficePhoneOrmEntity";

@Injectable()
export class TypeOrmOfficeRepository extends BmsOfficeRepository {
    constructor(
        @InjectRepository(OfficeOrmEntity)
        private readonly repoOffice: Repository<OfficeOrmEntity>,
        @InjectRepository(OfficePhoneOrmEntity)
        private readonly repoOfficePhone: Repository<OfficePhoneOrmEntity>,
    ) {
        super();
    }

    async findOneByCompanyAndName(
        companyId: string,
        name: string,
    ) {
        return this.repoOffice.findOne({
            select: ['id', 'name', 'company_id'],
            where: {
                company_id: companyId,
                name,
            },
        });
    }
    async findOneByCompanyAndCode(
        companyId: string,
        code: string,
    ) {
        return this.repoOffice.findOne({
            select: ['id', 'code', 'company_id'],
            where: {
                company_id: companyId,
                code,
            },
        });
    }
    async findOneByCompanyAndNameOrCode(
        companyId: string,
        name: string,
        code: string,
    ) {
        return this.repoOffice.findOne({
            select: ['id', 'name', 'code'],
            where: [
                { company_id: companyId, name },
                { company_id: companyId, code },
            ],
        });
    }

    async saveOffice(office: OfficeOrmEntity) {
        return this.repoOffice.save(office);
    }

    async findAllByCompanyId(companyId: string) {
        return this.repoOffice.find({
            select: ['id', 'name', 'code', 'address', 'note', 'status', 'created_at', 'updated_at'],
            where: {
                company_id: companyId,
            },
            relations: ['phones'],
            order: {
                created_at: 'ASC',
            },
        });
    }

    async findRoomWorkByCompanyId(companyId: string) {
        return this.repoOffice.find({
            select: ['id', 'name', 'code', 'address', 'note', 'status'],
            where: {
                company_id: companyId,
            },
            relations: ['phones'],
            order: {
                created_at: 'ASC',
            },
        });
    }

    async findById(officeId: string) {
        return this.repoOffice.findOne({
            where: {
                id: officeId,
            },
            relations: ['phones'],
        });
    }

    async deletePhonesNotInList(
        officeId: string,
        keepPhoneIds: string[],
    ): Promise<void> {
        const qb = this.repoOfficePhone
            .createQueryBuilder()
            .delete()
            .from(OfficePhoneOrmEntity)
            .where('office_id = :officeId', { officeId });

        if (keepPhoneIds.length > 0) {
            qb.andWhere('id NOT IN (:...keepPhoneIds)', { keepPhoneIds });
        }

        await qb.execute();
    }

    async deleteOffice(officeId: string): Promise<void> {
        await this.repoOffice.delete({ id: officeId });
    }

}