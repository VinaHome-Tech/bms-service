import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PointRepository } from "../../repositories/point.repository";
import { DTO_RQ_GlobalPoint } from "../../dtos/request/point.dto";
import { GlobalPointMapper } from "../../mappers/global-point.mapper";
import { GlobalPointOrmEntity } from "../../entities/GlobalPointOrmEntity.entity";

@Injectable()
export class UpdateGlobalPointUseCase {
    constructor(
        private readonly repo: PointRepository,
    ) {}

    async execute(id: string, data: Partial<DTO_RQ_GlobalPoint>) {

        // 1. Check record exists
        const existing = await this.repo.findGlobalPointById(id);
        if (!existing) throw new NotFoundException(`Điểm không tồn tại`);

        // 2. Check duplicate name (ignore itself)
        if (data.name) {
            const existName = await this.repo.findByNameGlobalPoint(data.name);
            if (existName && existName.id !== id) {
                throw new ConflictException(`Tên điểm "${data.name}" đã tồn tại`);
            }
        }


        // 4. Check province
        let exitsProvince = null;
        if (data.province_id) {
            exitsProvince = await this.repo.findProvinceById(data.province_id);
            if (!exitsProvince) {
                throw new NotFoundException(`Tỉnh/Thành phố không tồn tại`);
            }
        }

        // 5. Check ward
        let exitsWard = null;
        if (data.ward_id) {
            exitsWard = await this.repo.findWardById(data.ward_id);
            if (!exitsWard) {
                throw new NotFoundException(`Phường/Xã không tồn tại`);
            }
        }

        // 6. Build update object
        const updateData: Partial<GlobalPointOrmEntity> = {
            name: data.name?.trim() ?? existing.name,
            code: data.code?.toUpperCase().trim() ?? existing.code,

            province_id: data.province_id ?? existing.province_id,
            // province_code: exitsProvince?.province_code ?? existing.province_code,

            ward_id: data.ward_id ?? existing.ward_id,
            // ward_code: exitsWard?.ward_code ?? existing.ward_code,

            address: data.address?.trim() ?? existing.address,
        };

        // 7. Update the record
        await this.repo.updateGlobalPoint(id, updateData);

        // 8. Reload entity with relations
        const fullEntity = await this.repo.findGlobalPointById(id);

        return GlobalPointMapper.toResponse(fullEntity);
    }
}
