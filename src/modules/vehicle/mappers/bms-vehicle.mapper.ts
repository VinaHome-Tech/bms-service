import { DTO_RP_Vehicle } from "../dtos/response/bms/bms-vehicle.response";
import { VehicleOrmEntity } from "../entities/VehicleOrmEntity";

export class BmsVehicleMapper {
    static toResponse(entity: VehicleOrmEntity): DTO_RP_Vehicle {
        return {
            id: entity.id,
            license_plate: entity.license_plate,
            brand: entity.brand,
            color: entity.color,
            engine_number: entity.engine_number,
            frame_number: entity.frame_number,
            phone: entity.phone,
            registration_expiry: entity.registration_expiry,
            maintenance_due: entity.maintenance_due,
            status: entity.status,
            created_at: entity.created_at,
            updated_at: entity.updated_at,
        }
    }
    static toResponseList(entities: VehicleOrmEntity[]): DTO_RP_Vehicle[] {
        return entities.map(entity => this.toResponse(entity));
    }
}