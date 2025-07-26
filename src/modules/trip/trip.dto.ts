export class DTO_RQ_GetListTrip {
  route: number;
  date: Date;
  company: number;
}
export class DTO_RP_ListTrip {
  id: number;
  departure_date: Date;
  departure_time: string;
  seat_chart_id: number;
  seat_chart_name: string;
  route_id: number;
  route_name: string;
  trip_type: number;
  tickets_booked: number;
  total_ticket: number;
  vehicle_id: number;
  license_plate: string;
  vehicle_phone: string;
  assistant: EmployeeItem[];
  driver: EmployeeItem[];
  note: string;
  total_fare: number;
}
export class EmployeeItem {
  id: string;
  full_name: string;
  number_phone: string;
}
export class DTO_RP_UpdateTrip {
  id: number;
  departure_time: string;
  route_id: number;
  seat_chart_id: number;
  note: string;
  trip_type: number;
  vehicle_id: number;
  assistant: EmployeeItem[];
  driver: EmployeeItem[];
}

export class DTO_RQ_UpdateTrip {
  id: number;
  departure_date: string;
  departure_time: string;
  seat_chart_name: string;
  route_name: string;
  note: string;
  seat_chart_id: number;
  route_id: number;
  trip_type: number;
  tickets_booked: number;
  total_ticket: number;
  vehicle_id: number;
  assistant: EmployeeItem[];
  driver: EmployeeItem[];
}
