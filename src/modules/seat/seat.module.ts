import { Module } from '@nestjs/common';
import { SeatController } from './seat.controller';
import { SeatService } from './seat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeatChart } from '../../entities/seat_chart.entity';
import { Seat } from 'src/entities/seat.entity';
import { BmsSeatController } from './bms_seat.controller';
import { BmsSeatService } from './bms_seat.service';
import { PublicSeatController } from './public_seat.controller';
import { PublicSeatService } from './public_seat.service';

@Module({
  imports: [TypeOrmModule.forFeature([SeatChart, Seat])],
  controllers: [SeatController, BmsSeatController, PublicSeatController],
  providers: [SeatService, BmsSeatService, PublicSeatService],
  exports: [],
})
export class SeatModule {}
