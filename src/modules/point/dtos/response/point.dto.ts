export class DTO_RP_Province {
    id: string;
    name: string;
    province_code: string;
}
export class DTO_RP_Ward {
    id: string;
    name: string;
    ward_code: string;
}
export class DTO_RP_GlobalPoint {
    id: string;
    name: string;
    code: string;
    province: DTO_RP_Province;
    ward: DTO_RP_Ward; 
    address: string;
}