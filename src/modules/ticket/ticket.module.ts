import { Trip } from './../trip/trip.entity';
import { Module } from '@nestjs/common';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './ticket.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket, Trip])],
  controllers: [TicketController],
  providers: [TicketService],
})
export class TicketModule {}
