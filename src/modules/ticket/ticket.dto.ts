export class DTO_RP_Ticket {
  id: number;
  seat_name: string;
  seat_status: boolean;
  seat_floor: number;
  seat_row: number;
  seat_column: number;
  seat_type: number;
  seat_code: string;
  booked_status: boolean;
  ticket_phone: string;
  ticket_email: string;
  ticket_customer_name: string;
  ticket_point_up: string;
  ticket_point_down: string;
  ticket_note: string;
  ticket_display_price: number;
  payment_method: string;
  user_created: string;
  office_created: string;
}

export class DTO_RQ_TicketPayloadUpdate {
  id: number[];
  ticket_phone: string;
  ticket_email: string;
  ticket_customer_name: string;
  ticket_point_up: string;
  ticket_point_down: string;
  ticket_note: string;
  ticket_display_price: number;
  payment_method: string;
  booked_status: boolean;
  user_created: string;
  office_created: string;
}
export class DTO_RQ_CancelTicket {
  id: number[];
}
