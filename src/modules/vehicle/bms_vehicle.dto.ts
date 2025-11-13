import { IsDateString, IsInt, IsOptional, IsString } from "class-validator";

export class DTO_RQ_Vehicle {
  @IsString()
  license_plate: string;
  @IsString()
  @IsOptional()
  engine_number: string;
  @IsString()
  @IsOptional()
  frame_number: string;
  @IsInt()
  status: number;
  @IsString()
  @IsOptional()
  color: string;
  @IsString()
  @IsOptional()
  brand: string;
  @IsString()
  @IsOptional()
  phone: string;
  @IsDateString()
  @IsOptional()
  registration_expiry: Date;
  @IsDateString()
  @IsOptional()
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

export class DTO_RP_RegistrationExpiry {
  id: number;
  license_plate: string;
  registration_expiry: Date;
}
