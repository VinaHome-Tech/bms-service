import { DTO_RP_Ward } from "../dtos/response/point.dto";
import { WardOrmEntity } from "../entities/WardOrmEntity";

export class WardMapper {
    static toResponse(entity: WardOrmEntity): DTO_RP_Ward {
        return {
            id: entity.id,
            name: entity.name,
            ward_code: entity.code,
        };
    }
    static toResponseList(entities: WardOrmEntity[]): DTO_RP_Ward[] {
        return entities.map(this.toResponse);
    }
}   