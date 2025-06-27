import { Module } from '@nestjs/common';
import { SeatController } from './seat.controller';
import { SeatService } from './seat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeatChart } from './seat_chart.entity';
import { Seat } from './seat.entity';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [TypeOrmModule.forFeature([SeatChart, Seat]), CompanyModule],
  controllers: [SeatController],
  providers: [SeatService],
  exports: [],
})
export class SeatModule {}
