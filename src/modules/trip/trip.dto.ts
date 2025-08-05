export class DTO_RQ_GetListTrip {
  route: number;
  date: Date;
  company: string;
}
export class DTO_RP_ListTrip {
  trip_id: number;
  departure_date: string | Date;
  departure_time: string;
  vehicle_id: number | null;
  trip_type: number;
  note: string | null;
  driver: EmployeeItem[];
  assistant: EmployeeItem[];
  route_id: number;
  route_name: string;
  seat_chart_id: number;
  seat_chart_name: string;
  license_plate: string | null;
  vehicle_phone: string | null;
  tickets_booked: number;
  total_ticket: number;
  total_fare: number;
}
export class EmployeeItem {
  id: string;
  name: string;
  phone: string;
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
