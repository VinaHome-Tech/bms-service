import { IsArray, IsBoolean, IsOptional, IsString, IsUUID, MaxLength, MinLength, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";

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