export class DTO_RQ_Vehicle {
  license_plate: string;
  engine_number: string;
  frame_number: string;
  status: number;
  color: string;
  brand: string;
  phone: string;
  registration_expiry: Date;
  maintenance_due: Date;
}
export class DTO_RQ_UpdateVehicle {
  license_plate: string;
  engine_number: string;
  frame_number: string;
  status: number;
  color: string;
  brand: string;
  phone: string;
  registration_expiry: Date;
  maintenance_due: Date;
}

export class DTO_RP_Vehicle {
  id: number;
  license_plate: string;
  engine_number: string;
  frame_number: string;
  status: number;
  color: string;
  brand: string;
  phone: string;
  registration_expiry: Date;
  maintenance_due: Date;
}

export class DTO_RP_LicensePlate {
  id: number;
  license_plate: string;
}
