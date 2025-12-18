import { DTO_RP_Office, DTO_RP_OfficeRoomWork } from "../dtos/response/bms/office.dto";
import { OfficeOrmEntity } from "../entities/OfficeOrmEntity";

export class BmsOfficeMapper {
    static toResponse(entity: OfficeOrmEntity): DTO_RP_Office {
        return {
            id: entity.id,
            name: entity.name,
            code: entity.code,
            address: entity.address,
            note: entity.note,
            status: entity.status,
            phones: entity.phones?.map((p) => ({ id: p.id, phone: p.phone, type: p.type })) || [],
            created_at: entity.created_at,
            updated_at: entity.updated_at,
        };
    }
    static toResponseRoomWork(entity: OfficeOrmEntity): DTO_RP_OfficeRoomWork {
        return {
            id: entity.id,
            name: entity.name,
            address: entity.address,
            status: entity.status,
            phones: entity.phones?.map((p) => ({ id: p.id, phone: p.phone, type: p.type })) || [],
        };
    }
    static toResponseRoomWorkList(entities: OfficeOrmEntity[]): DTO_RP_OfficeRoomWork[] {
        return entities.map((e) => this.toResponseRoomWork(e));
    }
    static toResponseList(entities: OfficeOrmEntity[]): DTO_RP_Office[] {
        return entities.map((e) => this.toResponse(e));
    }
}