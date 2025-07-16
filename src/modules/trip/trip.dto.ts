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
}
