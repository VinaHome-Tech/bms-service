import { IsArray, IsBoolean, IsDateString, IsInt, IsOptional, IsString, IsUUID } from "class-validator";

export class DTO_RQ_Schedule {
    @IsDateString()
    start_date: Date;
    @IsDateString()
    @IsOptional()
    end_date: Date;
    @IsUUID()
    route_id: string;
    @IsUUID()
    @IsOptional()
    seat_chart_id: string;
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