import { ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { BmsOfficeRepository } from "../../repositories/bms/bms-office.repository";
import { DTO_RQ_Office } from "../../bms_office.dto";
import { OfficePhoneOrmEntity } from "../../entities/OfficePhoneOrmEntity";
import { OfficeOrmEntity } from "../../entities/OfficeOrmEntity";
import { BmsOfficeMapper } from "../../mappers/bms-office.mapper";

@Injectable()
export class CreateOfficeUseCase {
    constructor(private readonly repo: BmsOfficeRepository) { }

    async execute(companyId: string, data: DTO_RQ_Office) {
        const name = data.name.trim();
        const code = data.code.trim().toUpperCase();
        const address = data.address.trim();
        const note = data.note?.trim() || null;

        const existed = await this.repo.findOneByCompanyAndNameOrCode(
            companyId,
            name,
            code,
        );

        if (existed?.name === name) {
            throw new ConflictException('Tên văn phòng đã tồn tại.');
        }
        if (existed?.code === code) {
            throw new ConflictException('Mã văn phòng đã tồn tại.');
        }

        const phones =
            data.phones?.map((p) => ({
                phone: p.phone.trim(),
                type: p.type.trim(),
            })) || [];

        const phoneSet = new Set<string>();
        for (const p of phones) {
            if (phoneSet.has(p.phone)) {
                throw new ConflictException(
                    `Số điện thoại bị trùng trong cùng một văn phòng: ${p.phone}`,
                );
            }
            phoneSet.add(p.phone);
        }

        const office = new OfficeOrmEntity();
        office.company_id = companyId;
        office.name = name;
        office.code = code;
        office.address = address;
        office.note = note;
        office.status = data.status;

        office.phones = phones.map((p) => {
            const phone = new OfficePhoneOrmEntity();
            phone.phone = p.phone;
            phone.type = p.type;
            return phone;
        });

        const result = await this.repo.saveOffice(office);
        return BmsOfficeMapper.toResponse(result);
    }
}

