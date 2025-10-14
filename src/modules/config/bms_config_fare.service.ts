import { Injectable, NotFoundException } from '@nestjs/common';
import {
  DTO_RP_ConfigFare,
  DTO_RP_ConfigFare_1,
  DTO_RP_ConfigFare_2,
  DTO_RP_ConfigFare_3,
  DTO_RQ_ConfigFare,
  FareConfigDto,
} from './bms_config_fare.dto';
import { Route } from 'src/entities/route.entity';
import { Repository } from 'typeorm';
import { ConfigFare } from 'src/entities/config-fare.entity';
import { FareConfig } from 'src/entities/fare-config.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SeatChart } from 'src/entities/seat_chart.entity';

@Injectable()
export class BmsConfigFareService {
  constructor(
    @InjectRepository(FareConfig)
    private readonly fareConfigRepository: Repository<FareConfig>,
    @InjectRepository(ConfigFare)
    private readonly configFareRepository: Repository<ConfigFare>,
    @InjectRepository(Route)
    private readonly routeRepository: Repository<Route>,
    @InjectRepository(SeatChart)
    private readonly seatChartRepository: Repository<SeatChart>,
  ) {}

  async createConfigFare(data: DTO_RQ_ConfigFare): Promise<DTO_RP_ConfigFare> {
    console.log('Creating config fare with data:', data);
    try {
      const route = await this.routeRepository.findOne({
        select: ['id'],
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
      if (data.fare_configs?.length) {
        const fareConfigData = data.fare_configs.map((f) => ({
          departure_point_id: f.departure_point_id,
          arrival_point_id: f.arrival_point_id,
          single_room_price: f.single_room_price,
          double_room_price: f.double_room_price,
          config_fare_id: savedConfigFare.id,
        }));
        await this.fareConfigRepository
          .createQueryBuilder()
          .insert()
          .into('tbl_fare_config')
          .values(fareConfigData)
          .execute();
        savedConfigFare.fare_configs = await this.fareConfigRepository.find({
          where: { config_fare_id: savedConfigFare.id },
        });
      } else {
        savedConfigFare.fare_configs = [];
      }
      return {
        id: savedConfigFare.id,
        route_id: savedConfigFare.route_id,
        trip_type: savedConfigFare.trip_type,
        seat_chart_id: savedConfigFare.seat_chart_id,
        priority: savedConfigFare.priority,
        double_room: savedConfigFare.double_room,
        same_price: savedConfigFare.same_price,
        config_name: savedConfigFare.config_name,
        date_range: [savedConfigFare.start_date, savedConfigFare.end_date] as [
          Date,
          Date,
        ],
        fare_configs: savedConfigFare.fare_configs,
      };
    } catch (error) {
      console.error('Error creating config fare:', error);
      throw error;
    }
  }

  async getListConfigFareByCompany(
    companyId: string,
  ): Promise<DTO_RP_ConfigFare_3[]> {
    try {
      // 1️⃣ Lấy danh sách seat_chart chỉ của công ty này
      const seatCharts = await this.seatChartRepository.find({
        select: ['id', 'seat_chart_name'],
        where: { company_id: companyId },
      });

      // 2️⃣ Lấy toàn bộ config_fare kèm route và fare_configs
      const configFares = await this.configFareRepository.find({
        where: { company_id: companyId },
        relations: ['route', 'fare_configs'],
        order: { route_id: 'ASC', id: 'ASC' },
      });

      // 3️⃣ Gom nhóm theo route_id
      const grouped = new Map<number, DTO_RP_ConfigFare_3>();

      for (const cf of configFares) {
        const routeId = cf.route_id;

        if (!grouped.has(routeId)) {
          grouped.set(routeId, {
            route_id: routeId,
            route_name: cf.route?.route_name ?? '',
            config_fares: [],
          });
        }
        const routeGroup = grouped.get(routeId)!;

        // 4️⃣ Map seat_chart_id → seat_chart_name
        const seatChartDtos: DTO_RP_ConfigFare_1[] = [];
        if (Array.isArray(cf.seat_chart_id)) {
          for (const id of cf.seat_chart_id) {
            const seat = seatCharts.find((s) => s.id === id);
            seatChartDtos.push({
              seat_chart_id: id,
              seat_chart_name: seat?.seat_chart_name ?? '',
            });
          }
        }

        // 5️⃣ Map config_fare
        const mappedConfigFare: DTO_RP_ConfigFare_2 = {
          id: cf.id,
          route_id: cf.route_id,
          trip_type: cf.trip_type,
          seat_chart: seatChartDtos,
          priority: !!cf.priority,
          double_room: !!cf.double_room,
          same_price: !!cf.same_price,
          config_name: cf.config_name,
          date_range: [cf.start_date, cf.end_date] as [Date, Date],
          fare_configs:
            cf.fare_configs?.map(
              (f): FareConfigDto => ({
                id: f.id,
                departure_point_id: f.departure_point_id,
                arrival_point_id: f.arrival_point_id,
                single_room_price: f.single_room_price,
                double_room_price: f.double_room_price,
              }),
            ) ?? [],
        };

        routeGroup.config_fares.push(mappedConfigFare);
      }

      return Array.from(grouped.values());
    } catch (error) {
      console.error('Error in getListConfigFareByCompany:', error);
      throw error;
    }
  }
}
