import {
  DTO_RP_ListCustomerByTrip,
  DTO_RP_ListTransitDownByTrip,
  DTO_RP_ListTransitUpByTrip,
  DTO_RP_Ticket,
  DTO_RP_TicketsToPrint,
} from './ticket.dto';
import { Ticket } from './ticket.entity';

export class TicketMapper {
  static mapToTicketDTO(tickets: Ticket[]): DTO_RP_Ticket[] {
    return tickets.map((ticket) => {
      return {
        id: ticket.id,
        seat_name: ticket.seat_name,
        seat_status: ticket.seat_status,
        seat_floor: ticket.seat_floor,
        seat_row: ticket.seat_row,
        seat_column: ticket.seat_column,
        seat_type: ticket.seat_type,
        seat_code: ticket.seat_code,
        booked_status: ticket.booked_status,
        ticket_phone: ticket.ticket_phone || null,
        ticket_email: ticket.ticket_email || null,
        ticket_customer_name: ticket.ticket_customer_name || null,
        ticket_point_up: ticket.ticket_point_up || null,
        ticket_point_down: ticket.ticket_point_down || null,
        ticket_note: ticket.ticket_note || null,
        ticket_display_price: ticket.ticket_display_price || 0,
        payment_method: ticket.payment_method || null,
        user_created: ticket.user_created || null,
        office_created: ticket.office?.name || null,
        office_id: ticket.office?.id || null,
        contact_status: ticket.contact_status,
        transit_up: ticket.transit_up,
        transit_down: ticket.transit_down,
      };
    });
  }

  static mapTicketsToPrintDTO(tickets: Ticket[]): DTO_RP_TicketsToPrint[] {
    return tickets.map((ticket) => ({
      id: ticket.id,
      seat_name: ticket.seat_name,
      seat_status: ticket.seat_status,
      seat_floor: ticket.seat_floor,
      seat_row: ticket.seat_row,
      seat_column: ticket.seat_column,
      seat_type: ticket.seat_type,
      seat_code: ticket.seat_code,
      booked_status: ticket.booked_status,
      ticket_phone: ticket.ticket_phone,
      ticket_email: ticket.ticket_email,
      ticket_customer_name: ticket.ticket_customer_name,
      ticket_point_up: ticket.ticket_point_up,
      ticket_point_down: ticket.ticket_point_down,
      ticket_note: ticket.ticket_note,
      ticket_display_price: ticket.ticket_display_price,
      payment_method: ticket.payment_method,
    }));
  }

  static mapToCustomerListDTO(tickets: Ticket[]): DTO_RP_ListCustomerByTrip[] {
    return tickets.map((ticket) => {
      return {
        id: ticket.id,
        ticket_phone: ticket.ticket_phone,
        ticket_customer_name: ticket.ticket_customer_name,
        user_created: ticket.user_created,
        ticket_note: ticket.ticket_note,
        ticket_display_price: ticket.ticket_display_price,
        ticket_point_up: ticket.ticket_point_up,
        ticket_point_down: ticket.ticket_point_down,
        payment_method: ticket.payment_method,
        seat_name: ticket.seat_name,
      };
    });
  }

  static mapToTransitUpListDTO(
    tickets: Ticket[],
  ): DTO_RP_ListTransitUpByTrip[] {
    return tickets.map((ticket) => {
      return {
        id: ticket.id,
        ticket_phone: ticket.ticket_phone,
        ticket_customer_name: ticket.ticket_customer_name,
        user_created: ticket.user_created,
        ticket_note: ticket.ticket_note,
        ticket_display_price: ticket.ticket_display_price,
        ticket_point_up: ticket.ticket_point_up,
        seat_name: ticket.seat_name,
      };
    });
  }

  static mapToTransitDownListDTO(
    tickets: Ticket[],
  ): DTO_RP_ListTransitDownByTrip[] {
    return tickets.map((ticket) => {
      return {
        id: ticket.id,
        ticket_phone: ticket.ticket_phone,
        ticket_customer_name: ticket.ticket_customer_name,
        user_created: ticket.user_created,
        ticket_note: ticket.ticket_note,
        ticket_display_price: ticket.ticket_display_price,
        ticket_point_down: ticket.ticket_point_down,
        seat_name: ticket.seat_name,
      };
    });
  }
}
