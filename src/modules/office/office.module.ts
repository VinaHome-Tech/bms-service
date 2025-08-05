import { Module } from '@nestjs/common';
import { OfficeController } from './office.controller';
import { OfficeService } from './office.service';
import { Office } from './office.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfficePhone } from './office_phone.entity';
import { CompanyModule } from '../company/company.module';
import { Ticket } from '../ticket/ticket.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Office, OfficePhone, Ticket]),
    CompanyModule,
  ],
  controllers: [OfficeController],
  providers: [OfficeService],
  exports: [],
})
export class OfficeModule {}
