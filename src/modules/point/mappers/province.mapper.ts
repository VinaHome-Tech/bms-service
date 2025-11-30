import { DTO_RP_Province } from "../dtos/response/point.dto";
import { ProvinceOrmEntity } from "../entities/ProvinceOrmEntity";

export class ProvinceMapper {
    static toResponse(entity: ProvinceOrmEntity): DTO_RP_Province {
        return {
            id: entity.id,
            name: entity.name,
            province_code: entity.code,
        };
    }
    static toResponseList(entities: ProvinceOrmEntity[]): DTO_RP_Province[] {
        return entities.map(this.toResponse);
    }
}   