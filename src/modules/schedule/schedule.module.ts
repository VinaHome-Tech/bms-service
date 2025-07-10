import { Module } from '@nestjs/common';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';
import { CompanyModule } from '../company/company.module';
import { Schedule } from './schedule.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Schedule]), CompanyModule],
  controllers: [ScheduleController],
  providers: [ScheduleService],
  exports: [],
})
export class ScheduleModule {}
