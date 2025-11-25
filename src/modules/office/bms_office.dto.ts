import { Transform, Type } from "class-transformer";
import { IsArray, IsBoolean, IsInt, IsOptional, IsString, IsUUID, MaxLength, MinLength, ValidateNested } from "class-validator";


export class DTO_RQ_Office {
  @IsUUID()
  @IsOptional()
  id?: string;
  
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  code: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  address: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsOptional()
  @MaxLength(255)
  note?: string;

  @IsBoolean()
  status: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DTO_RQ_OfficePhone)
  phones: DTO_RQ_OfficePhone[];
}

export class DTO_RQ_OfficePhone {
  @IsUUID()
  @IsOptional()
  id?: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  phone: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  type: string;
}

export class DTO_RP_OfficeRoomWork {
  id: number;
  name: string;
  address: string;
  status: boolean;
  phones: DTO_RP_OfficePhone_2[];
}
export class DTO_RP_OfficePhone_2 {
  id: string;
  phone: string;
}


export class DTO_RP_Office {
  id: string;
  name: string;
  code: string;
  address: string;
  note: string;
  status: boolean;
  created_at: Date;
  phones: DTO_RP_OfficePhone[];
}

export class DTO_RP_Office_2 {
  id: number;
  name: string;
  code: string;
  address: string;
  status: boolean;
  company_id: number;
  company_name: string;
  company_code: string;
  phones: DTO_RP_OfficePhone[];
}

export class DTO_RP_OfficePhone {
  id: string;
  phone: string;
  type: string;
}

export class DTO_RQ_UpdateOffice {
  name: string;
  code: string;
  address: string;
  note: string;
  status: boolean;
  phones: DTO_RQ_OfficePhone[];
  company_id: number;
}
