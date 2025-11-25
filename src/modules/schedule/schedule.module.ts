import { Module } from '@nestjs/common';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';
import { Schedule } from '../../entities/schedule.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeatChart } from '../../entities/seat_chart.entity';
import { Route } from 'src/entities/route.entity';
import { BmsScheduleController } from './bms_schedule.controller';
import { BmsScheduleService } from './bms_schedule.service';
import { PublicScheduleController } from './public_schedule.controller';
import { PublicScheduleService } from './public_schedule.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Schedule, Route, SeatChart])
  ],
  controllers: [ScheduleController, BmsScheduleController, PublicScheduleController],
  providers: [ScheduleService, BmsScheduleService, PublicScheduleService],
  exports: [],
})
export class ScheduleModule {}
