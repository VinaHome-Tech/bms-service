import { Transform } from "class-transformer";
import { IsDateString, IsInt, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class DTO_RQ_Vehicle {
    @Transform(({ value }) => (typeof value === 'string' ? value.trim().toUpperCase() : value))
    @IsString({ message: 'Biển số xe phải là chuỗi ký tự' })
    @MinLength(5, { message: 'Biển số xe phải có ít nhất 5 ký tự' })
    @MaxLength(20, { message: 'Biển số xe không được vượt quá 20 ký tự' })
    license_plate: string;

    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsString({ message: 'Số máy phải là chuỗi ký tự' })
    @IsOptional()
    @MaxLength(100, { message: 'Số máy không được vượt quá 100 ký tự' })
    engine_number?: string;

    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsString({ message: 'Số khung phải là chuỗi ký tự' })
    @IsOptional()
    @MaxLength(100, { message: 'Số khung không được vượt quá 100 ký tự' })
    frame_number?: string;

    @IsInt({ message: 'Trạng thái phải là số nguyên' })
    status: number;

    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsString({ message: 'Màu xe phải là chuỗi ký tự' })
    @IsOptional()
    @MaxLength(50, { message: 'Màu xe không được vượt quá 50 ký tự' })
    color?: string;

    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsString({ message: 'Nhãn hiệu phải là chuỗi ký tự' })
    @IsOptional()
    @MaxLength(100, { message: 'Nhãn hiệu không được vượt quá 100 ký tự' })
    brand: string;

    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsString({ message: 'Số điện thoại phải là chuỗi ký tự' })
    @IsOptional()
    @Matches(/^0\d{9,10}$/, { message: 'Số điện thoại không hợp lệ (phải bắt đầu bằng 0 và dài 10–11 số)' })
    phone?: string;

    @IsDateString({}, { message: 'Ngày đăng kiểm không đúng định dạng (YYYY-MM-DD)' })
    @IsOptional()
    registration_expiry?: Date;

    @IsDateString({}, { message: 'Ngày bảo dưỡng không đúng định dạng (YYYY-MM-DD)' })
    @IsOptional()
    maintenance_due?: Date;

}