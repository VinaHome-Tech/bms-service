import { Transform, Type } from "class-transformer";
import { IsArray, IsBoolean, IsInt, IsOptional, IsString, MaxLength, Min, ValidateNested } from "class-validator";

export class DTO_RQ_Seat {
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  id?: string;

  @IsString({ message: 'Tên ghế phải là chuỗi ký tự' })
  @IsOptional()
  @MaxLength(50, { message: 'Tên ghế không được vượt quá 50 ký tự' })
  @Transform(({ value }) => value?.trim())
  name?: string;

  @IsString({ message: 'Mã ghế phải là chuỗi ký tự' })
  @MaxLength(20, { message: 'Mã ghế không được vượt quá 20 ký tự' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toUpperCase() : value))
  code: string;

  @IsBoolean({ message: 'Trạng thái ghế phải là true/false' })
  status: boolean;

  @IsInt({ message: 'Số tầng phải là số nguyên' })
  @Min(1, { message: 'Số tầng phải ≥ 1' })
  floor: number;

  @IsInt({ message: 'Hàng ghế phải là số nguyên' })
  @Min(1, { message: 'Hàng ghế phải ≥ 1' })
  row: number;

  @IsInt({ message: 'Cột ghế phải là số nguyên' })
  @Min(1, { message: 'Cột ghế phải ≥ 1' })
  column: number;
}
export class DTO_RQ_SeatChart {
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  id?: string;

  @IsString({ message: 'Tên sơ đồ ghế phải là chuỗi ký tự' })
  @MaxLength(255, { message: 'Tên sơ đồ ghế không được vượt quá 255 ký tự' })
  @Transform(({ value }) => value?.trim())
  seat_chart_name: string;

  @IsInt({ message: 'Loại sơ đồ phải là số nguyên' })
  @Min(1, { message: 'Loại sơ đồ phải ≥ 1' })
  seat_chart_type: number;

  @IsInt({ message: 'Số tầng phải là số nguyên' })
  @Min(1, { message: 'Số tầng phải ≥ 1' })
  total_floor: number;

  @IsInt({ message: 'Tổng số hàng phải là số nguyên' })
  @Min(1, { message: 'Tổng hàng phải ≥ 1' })
  total_row: number;

  @IsInt({ message: 'Tổng số cột phải là số nguyên' })
  @Min(1, { message: 'Tổng cột phải ≥ 1' })
  total_column: number;

  @IsInt()
  @IsOptional()
  total_seat?: number; // SẼ được tính lại ở service

  @IsArray({ message: 'Danh sách ghế phải là mảng' })
  @ValidateNested({ each: true })
  @Type(() => DTO_RQ_Seat)
  seats: DTO_RQ_Seat[];
}