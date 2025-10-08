import { Module } from '@nestjs/common';
import { TripController } from './trip.controller';
import { TripService } from './trip.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trip } from '../../entities/trip.entity';
import { Schedule } from '../../entities/schedule.entity';
import { SeatChart } from '../../entities/seat_chart.entity';
import { TripTicketSummary } from './trip_ticket_summary';
import { Route } from 'src/entities/route.entity';
import { Vehicle } from 'src/entities/vehicle.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Trip,
      Route,
      Schedule,
      SeatChart,
      Vehicle,
      TripTicketSummary,
    ]),
  ],
  controllers: [TripController],
  providers: [TripService],
})
export class TripModule {}
