import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PointRepository } from "../../repositories/point.repository";
import { DTO_RQ_GlobalPoint } from "../../dtos/request/point.dto";
import { GlobalPointMapper } from "../../mappers/global-point.mapper";

@Injectable()
export class CreateGlobalPointUseCase {
    constructor(
        private readonly repo: PointRepository,
    ) { }

    async execute(data: DTO_RQ_GlobalPoint) {
        // 1. Check duplicate name
        const existName = await this.repo.findByNameGlobalPoint(data.name);
        if (existName) throw new ConflictException(`Tên điểm "${data.name}" đã tồn tại`);
        // 3. Check province exists
        const exitsProvince = await this.repo.findProvinceById(data.province_id);
        console.log('exitsProvince', exitsProvince);
        if (!exitsProvince) throw new NotFoundException(`Tỉnh/Thành phố không tồn tại`);

        // 4. Check ward exists
        const exitsWard = await this.repo.findWardById(data.ward_id);
        console.log('exitsWard', exitsWard);
        if (!exitsWard) throw new NotFoundException(`Phường/Xã không tồn tại`);
        // 5. Create record
        const created = await this.repo.createGlobalPoint({
            name: data.name.trim(),
            code: data.code.toUpperCase().trim(),
            province_id: exitsProvince.id,
            // province_code: exitsProvince.province_code,
            ward_id: exitsWard.id,
            // ward_code: exitsWard.ward_code,
            address: data.address || null,
        });

        // 6. Load full entity with relations
        const fullEntity = await this.repo.findGlobalPointById(created.id);

        return GlobalPointMapper.toResponse(fullEntity);
    }
}