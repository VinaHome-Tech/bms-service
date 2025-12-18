import { DTO_RP_GlobalPoint } from "../dtos/response/point.dto";
import { GlobalPointOrmEntity } from "../entities/GlobalPointOrmEntity";

export class GlobalPointMapper {
    static toResponse(entity: GlobalPointOrmEntity): DTO_RP_GlobalPoint {
        return {
            id: entity.id,
            name: entity.name,
            code: entity.code,
            address: entity.address,
            province: {
                id: entity.province.id,
                name: entity.province.name,
                province_code: entity.province.code,
            },

            ward: {
                id: entity.ward.id,
                name: entity.ward.name,
                ward_code: entity.ward.code,
            },
        };
    }
    static toResponseList(entities: GlobalPointOrmEntity[]): DTO_RP_GlobalPoint[] {
        return entities.map(entity => this.toResponse(entity));
    }
}
