import { Module } from '@nestjs/common';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';
import { CompanyModule } from '../company/company.module';
import { Schedule } from './schedule.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Route } from '../route/route.entity';
import { SeatChart } from '../seat/seat_chart.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Schedule, Route, SeatChart]),
    CompanyModule,
  ],
  controllers: [ScheduleController],
  providers: [ScheduleService],
  exports: [],
})
export class ScheduleModule {}
