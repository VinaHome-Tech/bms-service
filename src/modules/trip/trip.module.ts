import { Module } from '@nestjs/common';
import { TripController } from './trip.controller';
import { TripService } from './trip.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trip } from './trip.entity';
import { Company } from '../company/company.entity';
import { Route } from '../route/route.entity';
import { Schedule } from '../schedule/schedule.entity';
import { SeatChart } from '../seat/seat_chart.entity';
import { Ticket } from '../ticket/ticket.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Trip,
      Company,
      Route,
      Schedule,
      SeatChart,
      Ticket,
    ]),
  ],
  controllers: [TripController],
  providers: [TripService],
})
export class TripModule {}
