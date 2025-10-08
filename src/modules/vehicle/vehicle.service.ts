import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  DTO_RP_LicensePlate,
  DTO_RP_RegistrationExpiry,
  DTO_RP_Vehicle,
  DTO_RQ_Vehicle,
} from './vehicle.dto';
import { DTO_RQ_UserAction } from 'src/utils/user.dto';
import { VehicleMapper } from './vehicle.mapper';
import { Vehicle } from 'src/entities/vehicle.entity';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
  ) {}

  async createVehicle(
    user: DTO_RQ_UserAction,
    data_create: DTO_RQ_Vehicle,
  ): Promise<DTO_RP_Vehicle> {
    console.log('User:', user);
    console.log('Data Create:', data_create);

    const existingVehicle = await this.vehicleRepository.findOne({
      where: {
        license_plate: data_create.license_plate,
        company_id: user.company_id,
      },
    });
    if (existingVehicle) {
      throw new ConflictException('Biển số xe đã tồn tại.');
    }
    const vehicle = VehicleMapper.toEntity(user, data_create);
    const savedVehicle = await this.vehicleRepository.save(vehicle);
    return VehicleMapper.toDTO(savedVehicle);
  }

  async getListVehicleByCompany(id: string): Promise<DTO_RP_Vehicle[]> {
    const vehicles = await this.vehicleRepository.find({
      where: { company_id: id },
      order: { created_at: 'DESC' },
    });

    if (!vehicles.length) {
      throw new NotFoundException('Không có phương tiện nào cho công ty này');
    }

    return vehicles.map((vehicle) => VehicleMapper.toDTO(vehicle));
  }

  async updateVehicle(
    id: number,
    user: DTO_RQ_UserAction,
    data_update: DTO_RQ_Vehicle,
  ): Promise<DTO_RP_Vehicle> {
    console.log('Update Vehicle ID:', id);
    console.log('User:', user);
    console.log('Data Update:', data_update);
    const existingVehicle = await this.vehicleRepository.findOne({
      where: { id },
    });

    if (!existingVehicle) {
      throw new NotFoundException('Phương tiện không tồn tại');
    }

    if (
      data_update.license_plate &&
      data_update.license_plate !== existingVehicle.license_plate
    ) {
      const vehicleWithSamePlate = await this.vehicleRepository.findOne({
        where: {
          license_plate: data_update.license_plate,
          company_id: user.company_id,
        },
      });

      if (vehicleWithSamePlate && vehicleWithSamePlate.id !== id) {
        throw new ConflictException('Biển số xe đã tồn tại.');
      }
    }

    Object.assign(existingVehicle, data_update);
    const updatedVehicle = await this.vehicleRepository.save(existingVehicle);
    return VehicleMapper.toDTO(updatedVehicle);
  }

  async deleteVehicle(id: number, user: DTO_RQ_UserAction): Promise<void> {
    console.log('Delete Vehicle ID:', id);
    console.log('User:', user);
    const vehicle = await this.vehicleRepository.findOne({ where: { id } });

    if (!vehicle) {
      throw new NotFoundException('Phương tiện không tồn tại');
    }

    await this.vehicleRepository.remove(vehicle);
  }

  // BM-32: Get License Plate By Company
  async getLicensePlateByCompany(id: string): Promise<DTO_RP_LicensePlate[]> {
    const vehicles = await this.vehicleRepository
      .createQueryBuilder('v')
      .select(['v.id AS id', 'v.license_plate AS license_plate'])
      .where('v.company_id = :id', { id })
      .andWhere('v.status = :status', { status: 1 })
      .getRawMany<DTO_RP_LicensePlate>();

    if (!vehicles.length) {
      throw new NotFoundException('Không có phương tiện nào');
    }

    return vehicles;
  }

  // BM-34 Get List Registration Expiry
  async getListRegistrationExpiry(
    id: string,
  ): Promise<DTO_RP_RegistrationExpiry[]> {
    const vehicles = await this.vehicleRepository.find({
      where: { company_id: id },
      select: {
        id: true,
        license_plate: true,
        registration_expiry: true,
      },
      order: { registration_expiry: 'ASC' },
    });
    if (!vehicles.length) {
      throw new NotFoundException('Không có phương tiện nào');
    }
    return vehicles;
  }
}
