import { IsOptional, IsString } from "class-validator";

export class DTO_RQ_GlobalPoint {
    @IsString()
    @IsOptional()
    id: string;
    @IsString()
    name: string;
    @IsString()
    code: string;
    @IsString()
    province_id: string;
    @IsString()
    province_code: string;
    @IsString()
    ward_id: string;
    @IsString()
    ward_code: string;
    @IsString()
    @IsOptional()
    address: string;
}