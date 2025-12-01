import { IsBoolean, IsInt, IsOptional, IsString } from "class-validator";

export class DTO_RQ_SuperAdminRoute {
    @IsString()
    @IsOptional()
    id: string;
    @IsString()
    route_name: string;
    @IsString()
    short_name: string;
    @IsInt()
    base_price: number;
    @IsString()
    route_name_e_ticket: string;
    @IsInt()
    e_ticket_price: number;
    @IsInt()
    @IsOptional()
    distance: number;
    @IsString()
    @IsOptional()
    journey: string;
    @IsString()
    @IsOptional()
    note: string;
    @IsBoolean()
    status: boolean;
    @IsInt()
    @IsOptional()
    display_order: number;
}