import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './vehicle.entity';
import { Company } from '../company/company.entity';
import {
  DTO_RP_LicensePlate,
  DTO_RP_Vehicle,
  DTO_RQ_CreateVehicle,
  DTO_RQ_UpdateVehicle,
} from './vehicle.dto';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async createVehicle(data: DTO_RQ_CreateVehicle): Promise<DTO_RP_Vehicle> {
    console.log(data);
    const company = await this.companyRepository.findOne({
      where: { id: data.company_id },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    const vehicle = this.vehicleRepository.create({
      ...data,
      company,
    });

    const savedVehicle = await this.vehicleRepository.save(vehicle);
    return {
      id: savedVehicle.id,
      license_plate: savedVehicle.license_plate,
      engine_number: savedVehicle.engine_number,
      frame_number: savedVehicle.frame_number,
      status: savedVehicle.status,
      color: savedVehicle.color,
      brand: savedVehicle.brand,
      phone: savedVehicle.phone,
      registration_expiry: savedVehicle.registration_expiry,
      maintenance_due: savedVehicle.maintenance_due,
    };
  }

  async getListVehicleByCompany(id: number): Promise<DTO_RP_Vehicle[]> {
    console.log(id);
    const vehicles = await this.vehicleRepository.find({
      where: { company: { id } },
    });

    if (!vehicles.length) {
      throw new NotFoundException('No vehicles found for this company');
    }

    return vehicles.map((vehicle) => ({
      id: vehicle.id,
      license_plate: vehicle.license_plate,
      engine_number: vehicle.engine_number,
      frame_number: vehicle.frame_number,
      status: vehicle.status,
      color: vehicle.color,
      brand: vehicle.brand,
      phone: vehicle.phone,
      registration_expiry: vehicle.registration_expiry,
      maintenance_due: vehicle.maintenance_due,
    }));
  }

  async updateVehicle(
    id: number,
    data: DTO_RQ_UpdateVehicle,
  ): Promise<DTO_RP_Vehicle> {
    console.log(data);
    const vehicle = await this.vehicleRepository.findOne({ where: { id } });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    Object.assign(vehicle, data);
    const updatedVehicle = await this.vehicleRepository.save(vehicle);
    return {
      id: updatedVehicle.id,
      license_plate: updatedVehicle.license_plate,
      engine_number: updatedVehicle.engine_number,
      frame_number: updatedVehicle.frame_number,
      status: updatedVehicle.status,
      color: updatedVehicle.color,
      brand: updatedVehicle.brand,
      phone: updatedVehicle.phone,
      registration_expiry: updatedVehicle.registration_expiry,
      maintenance_due: updatedVehicle.maintenance_due,
    };
  }

  async deleteVehicle(id: number): Promise<void> {
    console.log(id);
    const vehicle = await this.vehicleRepository.findOne({ where: { id } });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    await this.vehicleRepository.remove(vehicle);
  }

  async getLicensePlateByCompany(id: number): Promise<DTO_RP_LicensePlate[]> {
    console.log(id);
    const vehicles = await this.vehicleRepository.find({
      where: { company: { id } },
      select: ['id', 'license_plate'],
    });

    if (!vehicles.length) {
      throw new NotFoundException('No vehicles found for this company');
    }

    return vehicles.map((vehicle) => ({
      id: vehicle.id,
      license_plate: vehicle.license_plate,
    }));
  }
}
