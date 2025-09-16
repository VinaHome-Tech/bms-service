import { Trip } from './../trip/trip.entity';
import { Module } from '@nestjs/common';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './ticket.entity';
import { Office } from '../office/office.entity';
import { Schedule } from '../schedule/schedule.entity';
import { SeatChart } from '../seat/seat_chart.entity';
import { Seat } from '../seat/seat.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket, Trip, Office, Schedule, SeatChart, Seat]),
  ],
  controllers: [TicketController],
  providers: [TicketService],
})
export class TicketModule {}
