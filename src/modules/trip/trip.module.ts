import { Module } from '@nestjs/common';
import { BmsTripController } from './bms_trip.controller';
import { BmsTripService } from './bms_trip.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trip } from '../../entities/trip.entity';
import { Schedule } from '../../entities/schedule.entity';
import { SeatChart } from '../../entities/seat_chart.entity';
import { TripTicketSummary } from '../../entities/trip_ticket_summary.entity';
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
  controllers: [BmsTripController],
  providers: [BmsTripService],
})
export class TripModule {}
