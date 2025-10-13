import { Injectable, NotFoundException } from '@nestjs/common';
import { DTO_RQ_ConfigFare } from './bms_config_fare.dto';
import { Route } from 'src/entities/route.entity';
import { Repository } from 'typeorm';
import { ConfigFare } from 'src/entities/config-fare.entity';
import { FareConfig } from 'src/entities/fare-config.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BmsConfigFareService {
  constructor(
    @InjectRepository(FareConfig)
    private readonly fareConfigRepository: Repository<FareConfig>,
    @InjectRepository(ConfigFare)
    private readonly configFareRepository: Repository<ConfigFare>,
    @InjectRepository(Route)
    private readonly routeRepository: Repository<Route>,
  ) {}

  async createConfigFare(data: DTO_RQ_ConfigFare) {
    console.log('Creating config fare with data:', data);
    try {
      const route = await this.routeRepository.findOne({
        where: { id: data.route_id },
      });
      if (!route) {
        throw new NotFoundException('Dữ liệu tuyến không tồn tại');
      }
      const configFare = this.configFareRepository.create({
        route_id: route.id,
        trip_type: data.trip_type,
        seat_chart_id: data.seat_chart_id,
        priority: data.priority,
        double_room: data.double_room,
        same_price: data.same_price,
        company_id: data.company_id,
        config_name: data.config_name,
        start_date: data.date_range?.[0],
        end_date: data.date_range?.[1],
      });
      const savedConfigFare = await this.configFareRepository.save(configFare);
      if (data.fare_configs && data.fare_configs.length > 0) {
        const fareConfigs = data.fare_configs.map((f) =>
          this.fareConfigRepository.create({
            departure_point_id: f.departure_point_id,
            arrival_point_id: f.arrival_point_id,
            single_room_price: f.single_room_price,
            double_room_price: f.double_room_price,
            configFare: savedConfigFare,
          }),
        );
        await this.fareConfigRepository.save(fareConfigs);
        savedConfigFare.fare_configs = fareConfigs;
      }
      return savedConfigFare;
    } catch (error) {
      console.error('Error creating config fare:', error);
      throw error;
    }
  }
}
