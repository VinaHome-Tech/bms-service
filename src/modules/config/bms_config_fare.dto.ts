export class DTO_RQ_ConfigFare {
  route_id: number;
  trip_type: number;
  seat_chart_id: number[];
  priority: boolean;
  double_room: boolean;
  same_price: boolean;
  company_id: string;
  config_name: string;
  date_range: [Date, Date];
  fare_configs: FareConfigDto[];
}

export class FareConfigDto {
  id: number;
  departure_point_id: number[];
  arrival_point_id: number[];
  single_room_price: number;
  double_room_price: number;
}

export class DTO_RP_ConfigFare {
  id: number;
  route_id: number;
  trip_type: number;
  seat_chart_id: number[];
  priority: boolean;
  double_room: boolean;
  same_price: boolean;
  config_name: string;
  date_range: [Date, Date];
  fare_configs: FareConfigDto[];
}

export class DTO_RP_ConfigFare_1 {
  seat_chart_id: number;
  seat_chart_name: string;
}
export class DTO_RP_ConfigFare_2 {
  id: number;
  route_id: number;
  trip_type: number;
  seat_chart: DTO_RP_ConfigFare_1[];
  priority: boolean;
  double_room: boolean;
  same_price: boolean;
  config_name: string;
  date_range: [Date, Date];
  fare_configs: FareConfigDto[];
}

export class DTO_RP_ConfigFare_3 {
  route_id: number;
  route_name: string;
  config_fares: DTO_RP_ConfigFare_2[];
}
