export class DTO_RP_Province {
  id: number;
  name: string;
  code: number;
}
export class DTO_RP_Ward {
  id: number;
  name: string;
  code: number;
}
export class DTO_RQ_Point {
    id?: number;
    name: string;
    short_name: string;
    province_code: number;
    ward_code: number;
    address?: string;
}

export class DTO_RP_Point {
    id: number;
    name: string;
    short_name: string;
    province_code: number;
    province_name: string;
    ward_name: string;
    ward_code: number;
    address: string;
}

export class DTO_RP_PointName {
    id: number;
    name: string;
}
