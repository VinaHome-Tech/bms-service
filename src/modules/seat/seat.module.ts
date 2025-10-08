import { Module } from '@nestjs/common';
import { SeatController } from './seat.controller';
import { SeatService } from './seat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeatChart } from '../../entities/seat_chart.entity';
import { Seat } from 'src/entities/seat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SeatChart, Seat])],
  controllers: [SeatController],
  providers: [SeatService],
  exports: [],
})
export class SeatModule {}
