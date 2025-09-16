import { Module } from '@nestjs/common';
import { TripController } from './trip.controller';
import { TripService } from './trip.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trip } from './trip.entity';
import { Route } from '../route/route.entity';
import { Schedule } from '../schedule/schedule.entity';
import { SeatChart } from '../seat/seat_chart.entity';
import { Ticket } from '../ticket/ticket.entity';
import { Vehicle } from '../vehicle/vehicle.entity';
import { TripTicketSummary } from './trip_ticket_summary';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Trip,
      Route,
      Schedule,
      SeatChart,
      Ticket,
      Vehicle,
      TripTicketSummary,
    ]),
  ],
  controllers: [TripController],
  providers: [TripService],
})
export class TripModule {}
