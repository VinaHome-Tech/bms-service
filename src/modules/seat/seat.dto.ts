export class DTO_RQ_CreateSeatChart {
  seat_chart_name: string;
  seat_chart_type: number;
  total_floor: number;
  total_row: number;
  total_column: number;
  created_by: string;
  company_id: number;
  seats: DTO_RQ_CreateSeat[];
}
export class DTO_RQ_CreateSeat {
  name: string;
  code: string;
  status: boolean;
  floor: number;
  row: number;
  column: number;
  type: number;
}

export class DTO_RQ_UpdateSeatChart {
  id: number;
  seat_chart_name: string;
  seat_chart_type: number;
  total_floor: number;
  total_row: number;
  total_column: number;
  created_by: string;
  company_id: number;
  seats: DTO_RQ_UpdateSeat[];
}
export class DTO_RQ_UpdateSeat {
  id: number;
  name: string;
  code: string;
  status: boolean;
  floor: number;
  row: number;
  column: number;
  type: number;
}

export class DTO_RP_SeatChart {
  id: number;
  seat_chart_name: string;
  seat_chart_type: number;
  total_floor: number;
  total_row: number;
  total_column: number;
  created_by: string;
  created_at: Date;
  company_id: number;
  seats: DTO_RP_Seat[];
}
export class DTO_RP_Seat {
  id: number;
  code: string;
  name: string;
  status: boolean;
  floor: number;
  row: number;
  column: number;
  type: number;
}
