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

