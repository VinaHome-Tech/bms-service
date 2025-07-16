import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from './ticket.entity';
import { Repository, In } from 'typeorm';
import { Trip } from '../trip/trip.entity';
import {
  DTO_RP_Ticket,
  DTO_RQ_CancelTicket,
  DTO_RQ_TicketPayloadUpdate,
} from './ticket.dto';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(Trip)
    private readonly tripRepository: Repository<Trip>,
  ) {}

  async getListTicketsByTrip(id: number): Promise<DTO_RP_Ticket[]> {
    console.log(`Fetching tickets for trip ID: ${id}`);
    const existingTrip = await this.tripRepository.findOne({
      where: { id },
      relations: ['tickets'],
    });
    if (!existingTrip) {
      throw new NotFoundException('Chuyến không tồn tại');
    }
    return existingTrip.tickets.map((ticket) => {
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
        ticket_phone: ticket.ticket_phone,
        ticket_email: ticket.ticket_email,
        ticket_customer_name: ticket.ticket_customer_name,
        ticket_point_up: ticket.ticket_point_up,
        ticket_point_down: ticket.ticket_point_down,
        ticket_note: ticket.ticket_note,
        ticket_display_price: ticket.ticket_display_price,
      } as DTO_RP_Ticket;
    });
  }

  async updateTicket(
    data: DTO_RQ_TicketPayloadUpdate,
  ): Promise<DTO_RP_Ticket[]> {
    console.log(data);

    const tickets = await this.ticketRepository.findByIds(data.id);
    if (tickets.length === 0) {
      throw new NotFoundException('Dữ liệu vé không tồn tại');
    }
    if (tickets.length !== data.id.length) {
      throw new NotFoundException('Dữ liệu vé không đầy đủ');
    }

    const updatePromises = tickets.map(async (ticket) => {
      ticket.ticket_phone = data.ticket_phone;
      ticket.ticket_email = data.ticket_email;
      ticket.ticket_customer_name = data.ticket_customer_name;
      ticket.ticket_point_up = data.ticket_point_up;
      ticket.ticket_point_down = data.ticket_point_down;
      ticket.ticket_note = data.ticket_note;
      ticket.ticket_display_price = data.ticket_display_price;
      ticket.payment_method = data.payment_method;
      ticket.user_created = data.user_created;
      ticket.office_created = data.office_created;
      if (data.booked_status === false) {
        ticket.booked_status = true;
      }

      return await this.ticketRepository.save(ticket);
    });

    const updatedTickets = await Promise.all(updatePromises);

    return updatedTickets.map((ticket) => {
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
        ticket_phone: ticket.ticket_phone,
        ticket_email: ticket.ticket_email,
        ticket_customer_name: ticket.ticket_customer_name,
        ticket_point_up: ticket.ticket_point_up,
        ticket_point_down: ticket.ticket_point_down,
        ticket_note: ticket.ticket_note,
        ticket_display_price: ticket.ticket_display_price,
        payment_method: ticket.payment_method,
        user_created: ticket.user_created,
        office_created: ticket.office_created,
      } as DTO_RP_Ticket;
    });
  }

  async cancelTicket(data: DTO_RQ_CancelTicket): Promise<DTO_RP_Ticket[]> {
    console.log(data);
    const tickets = await this.ticketRepository.find({
      where: { id: In(data.id) },
      relations: ['trip', 'trip.route'],
    });
    if (tickets.length === 0) {
      throw new NotFoundException('Dữ liệu vé không tồn tại');
    }
    if (tickets.length !== data.id.length) {
      throw new NotFoundException('Dữ liệu vé không đầy đủ');
    }

    const cancelPromises = tickets.map(async (ticket) => {
      if (ticket.booked_status === true) {
        ticket.booked_status = false;
        ticket.ticket_phone = null;
        ticket.ticket_email = null;
        ticket.ticket_customer_name = null;
        ticket.ticket_point_up = null;
        ticket.ticket_point_down = null;
        ticket.ticket_note = null;
        ticket.ticket_display_price = ticket.trip.route.base_price;
        ticket.payment_method = null;
        ticket.user_created = null;
        ticket.office_created = null;
      }
      return await this.ticketRepository.save(ticket);
    });

    const canceledTickets = await Promise.all(cancelPromises);
    console.log('Canceled tickets:', canceledTickets);

    return canceledTickets.map((ticket) => {
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
        ticket_phone: ticket.ticket_phone,
        ticket_email: ticket.ticket_email,
        ticket_customer_name: ticket.ticket_customer_name,
        ticket_point_up: ticket.ticket_point_up,
        ticket_point_down: ticket.ticket_point_down,
        ticket_note: ticket.ticket_note,
        ticket_display_price: ticket.ticket_display_price,
      } as DTO_RP_Ticket;
    });
  }
}
