import { Type } from "class-transformer";
import { IsBoolean, IsInt, IsOptional, IsString, ValidateNested } from "class-validator";

export class DTO_RQ_Office {
  @IsString()
  name: string;
  @IsString()
  code: string;
  @IsString()
  address: string;
  @IsString()
  @IsOptional()
  note: string;
  @IsBoolean()
  status: boolean;

  @ValidateNested()
  @Type(() => DTO_RQ_OfficePhone)
  phones: DTO_RQ_OfficePhone[];
}
export class DTO_RQ_OfficePhone {
  @IsInt()
  @IsOptional()
  id: number;
  @IsString()
  phone: string;
  @IsString()
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
  id: number;
  phone: string;
}


export class DTO_RP_Office {
  id: number;
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
  id: number;
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
