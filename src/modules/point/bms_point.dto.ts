export class DTO_RP_GroupPointName {
  id: number;
  province_name: string;
  points: DTO_RP_ItemPointName[];
}
export class DTO_RP_ItemPointName {
  id: number;
  name: string;
}
export class DTO_RP_ItemPointConfigTime {
  id: number;
  point_name: string;
  display_order: number;
  time_gap: string;
  address: string;
}

export class DTO_RQ_ItemPointConfigTime {
  id: number;
  time_gap: string;
  display_order: number;
}
