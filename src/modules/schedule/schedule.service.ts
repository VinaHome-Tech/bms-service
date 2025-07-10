import { Injectable } from '@nestjs/common';
import { DTO_RQ_CreateSchedule } from './schedule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../company/company.entity';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}
  async createSchedule(data: DTO_RQ_CreateSchedule): Promise<any> {
    console.log(data);
  }
}
