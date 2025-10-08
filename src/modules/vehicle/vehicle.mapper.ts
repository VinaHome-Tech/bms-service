import { DTO_RQ_UserAction } from 'src/utils/user.dto';
import { DTO_RP_Vehicle, DTO_RQ_Vehicle } from './vehicle.dto';
import { Vehicle } from 'src/entities/vehicle.entity';

export class VehicleMapper {
  static toDTO(vehicle: Vehicle): DTO_RP_Vehicle {
    return {
      id: vehicle.id,
      license_plate: vehicle.license_plate,
      engine_number: vehicle.engine_number,
      frame_number: vehicle.frame_number,
      status: vehicle.status,
      color: vehicle.color,
      brand: vehicle.brand,
      phone: vehicle.phone,
      registration_expiry: vehicle.registration_expiry,
      maintenance_due: vehicle.maintenance_due,
    };
  }

  static toEntity(user: DTO_RQ_UserAction, data: DTO_RQ_Vehicle): Vehicle {
    const vehicle = new Vehicle();
    vehicle.license_plate = data.license_plate;
    vehicle.engine_number = data.engine_number;
    vehicle.frame_number = data.frame_number;
    vehicle.status = data.status;
    vehicle.color = data.color;
    vehicle.brand = data.brand;
    vehicle.phone = data.phone;
    vehicle.company_id = user.company_id;
    vehicle.registration_expiry = data.registration_expiry;
    vehicle.maintenance_due = data.maintenance_due;
    return vehicle;
  }
}
