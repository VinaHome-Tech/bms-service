import { ConflictException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { BmsOfficeRepository } from "../../repositories/bms/bms-office.repository";
import { BmsOfficeMapper } from "../../mappers/bms-office.mapper";
import { OfficePhoneOrmEntity } from "../../entities/OfficePhoneOrmEntity";
import { DTO_RQ_Office } from "../../dtos/request/bms/office.dto";

@Injectable()
export class UpdateOfficeUseCase {
    constructor(private readonly repo: BmsOfficeRepository) { }

    async execute(officeId: string, data: DTO_RQ_Office) {

        try {
            // ==== 1. Load office + phones ====
            const office = await this.repo.findById(officeId);
            if (!office) {
                throw new NotFoundException('Văn phòng không tồn tại.');
            }

            // ==== 2. Normalize ====
            const name = data.name.trim();
            const code = data.code.trim().toUpperCase();
            const address = data.address.trim();
            const note = data.note?.trim() || null;

            // ==== 3. Check duplicate name / code (nếu thay đổi) ====
            if (office.name !== name || office.code !== code) {
                const existed = await this.repo.findOneByCompanyAndNameOrCode(
                    office.company_id,
                    name,
                    code,
                );

                if (existed && existed.id !== office.id) {
                    if (existed.name === name) {
                        throw new ConflictException('Tên văn phòng đã tồn tại.');
                    }
                    if (existed.code === code) {
                        throw new ConflictException('Mã văn phòng đã tồn tại.');
                    }
                }
            }

            // ==== 4. Check duplicate phones trong request ====
            const requestPhones = data.phones ?? [];
            const phoneSet = new Set<string>();

            for (const p of requestPhones) {
                const phone = p.phone.trim();
                if (phoneSet.has(phone)) {
                    throw new ConflictException(
                        `Số điện thoại bị trùng trong cùng văn phòng: ${phone}`,
                    );
                }
                phoneSet.add(phone);
            }

            // ==== 5. Update office fields ====
            office.name = name;
            office.code = code;
            office.address = address;
            office.note = note;
            office.status = data.status;

            // ==== 6. DELETE phones bị FE bỏ ====
            const keepPhoneIds = requestPhones
                .filter(p => p.id)
                .map(p => p.id);

            await this.repo.deletePhonesNotInList(office.id, keepPhoneIds);

            // ==== 7. Update / Create phones ====
            const existingPhoneMap = new Map(
                (office.phones ?? []).map(p => [p.id, p]),
            );

            const finalPhones: OfficePhoneOrmEntity[] = [];
            let updated = 0;
            let created = 0;

            for (const p of requestPhones) {
                if (p.id && existingPhoneMap.has(p.id)) {
                    const existing = existingPhoneMap.get(p.id)!;
                    existing.phone = p.phone.trim();
                    existing.type = p.type.trim();
                    existing.office = office;
                    finalPhones.push(existing);
                    updated++;
                } else {
                    const newPhone = new OfficePhoneOrmEntity();
                    newPhone.phone = p.phone.trim();
                    newPhone.type = p.type.trim();
                    newPhone.office = office;
                    finalPhones.push(newPhone);
                    created++;
                }
            }

            office.phones = finalPhones;

            // ==== 8. Save ====
            const result = await this.repo.saveOffice(office);

            return BmsOfficeMapper.toResponse(result);

        } catch (error) {
            console.error('[UpdateOffice] ERROR', {
                officeId,
                message: error.message,
                name: error.name,
            });

            if (error instanceof HttpException) {
                throw error;
            }

            throw new InternalServerErrorException(
                'Lỗi hệ thống. Vui lòng thử lại sau.',
            );
        }
    }
}


