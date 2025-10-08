import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DTO_RP_Office, DTO_RQ_Office } from './office.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Office } from '../../entities/office.entity';
import { OfficePhone } from './office_phone.entity';
import { DTO_RQ_UserAction } from 'src/utils/user.dto';
import { OfficeMapper } from './office.mapper';

@Injectable()
export class OfficeService {
  constructor(
    // @InjectRepository(Company)
    // private readonly companyRepository: Repository<Company>,

    @InjectRepository(Office)
    private readonly officeRepository: Repository<Office>,

    @InjectRepository(OfficePhone)
    private readonly officePhoneRepository: Repository<OfficePhone>,
  ) {}

  async createOffice(
    user: DTO_RQ_UserAction,
    data_create: DTO_RQ_Office,
  ): Promise<DTO_RP_Office> {
    console.log('User:', user);
    console.log('Data Create:', data_create);
    const existingOffice = await this.officeRepository.findOne({
      where: {
        name: data_create.name,
        company_id: user.company_id,
      },
    });
    if (existingOffice) {
      throw new ConflictException('Tên văn phòng đã tồn tại.');
    }
    const office = OfficeMapper.toCreateEntity(user, data_create);
    const savedOffice = await this.officeRepository.save(office);
    if (savedOffice.phones) {
      savedOffice.phones.forEach((p) => delete p.office);
    }
    console.log('Saved Office:', savedOffice);
    return OfficeMapper.toDTO(savedOffice);
  }

  async deleteOffice(id: number, user: DTO_RQ_UserAction): Promise<void> {
    console.log('Delete Office ID:', id);
    console.log('User:', user);
    const office = await this.officeRepository.findOne({
      where: { id },
    });

    if (!office) {
      throw new NotFoundException('Văn phòng không tồn tại');
    }

    await this.officeRepository.remove(office);
  }

  async updateOffice(
    id: number,
    user: DTO_RQ_UserAction,
    data_update: DTO_RQ_Office,
  ): Promise<DTO_RP_Office> {
    console.log('Update Office ID:', id);
    console.log('User:', user);
    console.log('Data Update:', data_update);
    const office = await this.officeRepository.findOne({
      where: { id },
      relations: [ 'phones' ],
    });

    if (!office) {
      throw new NotFoundException('Văn phòng không tồn tại');
    }

    if (data_update.name) {
      const existingOffice = await this.officeRepository.findOne({
        where: {
          name: data_update.name,
          company_id: user.company_id,
        },
      });
      if (existingOffice && existingOffice.id !== id) {
        throw new ConflictException('Tên văn phòng đã tồn tại.');
      }
    }

    office.name = data_update.name;
    office.code = data_update.code;
    office.address = data_update.address;
    office.note = data_update.note;
    office.status = data_update.status;

    if (data_update.phones) {
      const inputPhones = data_update.phones;

      const inputPhoneIds = inputPhones.filter((p) => p.id).map((p) => p.id);

      office.phones = office.phones.filter((existingPhone) => {
        if (!inputPhoneIds.includes(existingPhone.id)) {
          this.officePhoneRepository.delete(existingPhone.id);
          return false;
        }
        return true;
      });

      for (const phone of inputPhones) {
        if (phone.id) {
          const existing = office.phones.find((p) => p.id === phone.id);
          if (existing) {
            existing.phone = phone.phone;
            existing.type = phone.type;
          }
        } else {
          const newPhone = this.officePhoneRepository.create({
            phone: phone.phone,
            type: phone.type,
            office: office,
          });
          office.phones.push(newPhone);
        }
      }
    }

    const updatedOffice = await this.officeRepository.save(office);

    if (updatedOffice.phones) {
      updatedOffice.phones.forEach((p) => delete p.office);
    }

    return OfficeMapper.toDTO(updatedOffice);
  }

  async getListOfficeByCompany(id: string): Promise<DTO_RP_Office[]> {
    const offices = await this.officeRepository.find({
      where: { company_id: id },
      relations: [ 'phones' ],
      order: { created_at: 'DESC' },
    });
    return offices.map((office) => OfficeMapper.toDTO(office));
  }

  async getListOfficeNameByCompany(
    id: number,
  ): Promise<{ id: number; name: string }[]> {
    // const company = await this.companyRepository.findOne({
    //   where: { id },
    //   relations: ['offices'],
    // });

    // if (!company) {
    //   throw new NotFoundException('Công ty không tồn tại');
    // }
    return null;

    // return company.offices.map((office) => ({
    //   id: office.id,
    //   name: office.name,
    // }));
  }

  // BM-33 Get List Office Room Work By Company
  async getListOfficeRoomWorkByCompany(id: string): Promise<DTO_RQ_Office[]> {
    const offices = await this.officeRepository
      .createQueryBuilder('office')
      .leftJoinAndSelect('office.phones', 'phone')
      .where('office.company_id = :companyId', { companyId: id })
      .orderBy('office.created_at', 'DESC')
      .select([
        'office.id',
        'office.name',
        'office.code',
        'office.address',
        'office.note',
        'office.status',
        'office.created_at',
        'phone.id',
        'phone.phone',
        'phone.type',
      ])
      .getMany();

    if (!offices || offices.length === 0) {
      throw new NotFoundException(
        'Không tìm thấy văn phòng nào cho công ty này',
      );
    }
    return offices.map((office) => OfficeMapper.toDTO(office));
  }
}
