
import {
  IsInt,
  IsOptional,
  IsString,
  IsBoolean,
  Min,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class DTO_RQ_Route {
  @IsInt({ message: 'Giá vé cơ bản phải là số nguyên' })
  @Min(0, { message: 'Giá vé cơ bản không được nhỏ hơn 0' })
  base_price: number;

  @IsInt({ message: 'Quãng đường phải là số nguyên' })
  @Min(0, { message: 'Quãng đường không được nhỏ hơn 0' })
  @IsOptional()
  distance?: number;

  @IsInt({ message: 'Giá vé điện tử phải là số nguyên' })
  @Min(0, { message: 'Giá vé điện tử không được nhỏ hơn 0' })
  @IsOptional()
  e_ticket_price?: number;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'Hành trình phải là chuỗi ký tự' })
  @MaxLength(255, { message: 'Hành trình không được vượt quá 255 ký tự' })
  @IsOptional()
  journey?: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'Ghi chú phải là chuỗi ký tự' })
  @MaxLength(255, { message: 'Ghi chú không được vượt quá 255 ký tự' })
  @IsOptional()
  note?: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'Tên tuyến đường phải là chuỗi ký tự' })
  @MinLength(2, { message: 'Tên tuyến đường phải có ít nhất 2 ký tự' })
  @MaxLength(255, { message: 'Tên tuyến đường không được vượt quá 255 ký tự' })
  route_name: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'Tên tuyến đường điện tử phải là chuỗi ký tự' })
  @MaxLength(255, { message: 'Tên tuyến đường điện tử không được vượt quá 255 ký tự' })
  @IsOptional()
  route_name_e_ticket?: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'Tên ngắn phải là chuỗi ký tự' })
  @MinLength(2, { message: 'Tên ngắn phải có ít nhất 2 ký tự' })
  @MaxLength(100, { message: 'Tên ngắn không được vượt quá 100 ký tự' })
  short_name: string;

  @IsBoolean()
  status: boolean;

  @IsInt({ message: 'Thứ tự hiển thị phải là số nguyên' })
  @Min(0, { message: 'Thứ tự hiển thị không được nhỏ hơn 0' })
  @IsOptional()
  display_order?: number;
}

export class DTO_RP_Route {
    id: number;
    base_price: number;
    distance: number;
    e_ticket_price: number;
    journey: string;
    note: string;
    route_name: string;
    route_name_e_ticket: string;
    short_name: string;
    status: boolean;
    display_order: number;
}