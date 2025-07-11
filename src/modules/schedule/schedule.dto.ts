export class DTO_RQ_CreateSchedule {
  route_id: number;
  seat_chart_id: number;
  start_time: string;
  repeat_type: string;
  weekdays: string[];
  odd_even_type: string;
  start_date: string;
  end_date: string;
  is_known_end_date: boolean;
  trip_type: number;
  created_by: string;
  company_id: number;
}

export class DTO_RQ_UpdateSchedule {
  id: number;
  route_id: number;
  seat_chart_id: number;
  start_time: string;
  repeat_type: string;
  weekdays: string[];
  odd_even_type: string;
  start_date: string;
  end_date: string;
  is_known_end_date: boolean;
  trip_type: number;
  created_by: string;
  company_id: number;
}

export class DTO_RP_Schedule {
  id: number;
  route_id: number;
  route_name: string;
  seat_chart_id: number;
  seat_chart_name: string;
  start_time: string;
  repeat_type: string;
  weekdays: string[];
  odd_even_type: string;
  start_date: string;
  end_date: string;
  is_known_end_date: boolean;
  trip_type: number;
  created_by: string;
  created_at: string;
}
