import { Module } from '@nestjs/common';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';
import { Schedule } from '../../entities/schedule.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeatChart } from '../../entities/seat_chart.entity';
import { Route } from 'src/entities/route.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Schedule, Route, SeatChart])
  ],
  controllers: [ScheduleController],
  providers: [ScheduleService],
  exports: [],
})
export class ScheduleModule {}
