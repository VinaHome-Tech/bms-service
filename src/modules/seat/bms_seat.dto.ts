import { Type } from "class-transformer";
import { IsBoolean, IsInt, IsOptional, IsString, ValidateNested } from "class-validator";

export class Seat {
    @IsInt()
    @IsOptional()
    id: number;
    @IsString()
    @IsOptional()
    name: string;
    @IsString()
    code: string;
    @IsBoolean()
    status: boolean;
    @IsInt()
    floor: number;
    @IsInt()
    row: number;
    @IsInt()
    column: number;
}
export class DTO_RQ_SeatChart {
    @IsInt()
    @IsOptional()
    id: number;
    @IsString()
    seat_chart_name: string;
    @IsInt()
    seat_chart_type: number;
    @IsInt()
    total_floor: number;
    @IsInt()
    total_row: number;
    @IsInt()
    total_column: number;
    @IsInt()
    @IsOptional()
    total_seat: number;
    @ValidateNested()
    @Type(() => Seat)
    seats: Seat[];
}