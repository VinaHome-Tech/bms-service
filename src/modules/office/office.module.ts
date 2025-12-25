import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BmsOfficeController } from './controllers/bms-office.controller';
import { BmsOfficeRepository } from './repositories/bms/bms-office.repository';
import { TypeOrmOfficeRepository } from './repositories/bms/typeorm-bms-office.repository';
import { OfficeOrmEntity } from './entities/OfficeOrmEntity';
import { OfficePhoneOrmEntity } from './entities/OfficePhoneOrmEntity';
import { CreateOfficeUseCase } from './use-cases/bms/create-office.usecase';
import { GetOfficeListByCompanyIdUseCase } from './use-cases/bms/get-office-list-by-company-id.usecase';
import { UpdateOfficeUseCase } from './use-cases/bms/update-office.usecase';
import { DeleteOfficeUseCase } from './use-cases/bms/delete-office.usecase';
import { GetOfficeListRoomWorkByCompanyIdUseCase } from './use-cases/bms/get-office-list-room-work-by-company-id.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([OfficeOrmEntity, OfficePhoneOrmEntity])],
  controllers: [BmsOfficeController],
  providers: [
    {
      provide: BmsOfficeRepository,
      useClass: TypeOrmOfficeRepository,
    },
    CreateOfficeUseCase,
    UpdateOfficeUseCase,
    DeleteOfficeUseCase,
    GetOfficeListByCompanyIdUseCase,
    GetOfficeListRoomWorkByCompanyIdUseCase,
    ],
  exports: [],
})
export class OfficeModule {}
