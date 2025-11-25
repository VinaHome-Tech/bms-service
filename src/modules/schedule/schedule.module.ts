import { Module } from '@nestjs/common';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';
import { Schedule } from '../../entities/schedule.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeatChart } from '../../entities/seat_chart.entity';
import { Route } from 'src/entities/route.entity';
import { BmsScheduleController } from './bms_schedule.controller';
import { BmsScheduleService } from './bms_schedule.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Schedule, Route, SeatChart])
  ],
  controllers: [ScheduleController, BmsScheduleController],
  providers: [ScheduleService, BmsScheduleService],
  exports: [],
})
export class ScheduleModule {}
