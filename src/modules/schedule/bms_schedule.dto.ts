import { IsArray, IsBoolean, IsDateString, IsInt, IsOptional, IsString } from "class-validator";

export class DTO_RQ_Schedule {
    @IsInt()
    @IsOptional()
    id: number;
    @IsDateString()
    start_date: Date;
    @IsDateString()
    @IsOptional()
    end_date: Date;
    @IsInt()
    route_id: number;
    @IsInt()
    @IsOptional()
    seat_chart_id: number;
    @IsString()
    start_time: string;
    @IsInt()
    trip_type: number;
    @IsString()
    repeat_type: string;
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    weekdays: string[];
    @IsString()
    @IsOptional()
    odd_even_type: string;
    @IsBoolean()
    is_known_end_date: boolean;
}