import { IsBoolean, IsInt, IsOptional, IsString } from "class-validator";

export class DTO_RQ_Route {
    @IsInt()
    base_price: number;
    @IsInt()
    @IsOptional()
    distance: number;
    @IsInt()
    @IsOptional()
    e_ticket_price: number;
    @IsString()
    @IsOptional()
    journey: string;
    @IsString()
    @IsOptional()
    note: string;
    @IsString()
    route_name: string;
    @IsString()
    @IsOptional()
    route_name_e_ticket: string;
    @IsString()
    short_name: string;
    @IsBoolean()
    status: boolean;
    @IsInt()
    @IsOptional()
    display_order: number;
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