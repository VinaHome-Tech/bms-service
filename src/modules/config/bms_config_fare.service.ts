// import { Injectable, NotFoundException } from '@nestjs/common';
// import {
//   DTO_RP_ConfigFare,
//   DTO_RP_ConfigFare_1,
//   DTO_RP_ConfigFare_2,
//   DTO_RP_ConfigFare_3,
//   DTO_RQ_ConfigFare,
//   FareConfigDto,
// } from './bms_config_fare.dto';
// import { Route } from 'src/entities/route.entity';
// import { Repository } from 'typeorm';
// import { ConfigFare } from 'src/entities/config-fare.entity';
// import { FareConfig } from 'src/entities/fare-config.entity';
// import { InjectRepository } from '@nestjs/typeorm';
// import { SeatChart } from 'src/entities/seat_chart.entity';

// @Injectable()
// export class BmsConfigFareService {
//   constructor(
//     @InjectRepository(FareConfig)
//     private readonly fareConfigRepository: Repository<FareConfig>,
//     @InjectRepository(ConfigFare)
//     private readonly configFareRepository: Repository<ConfigFare>,
//     @InjectRepository(Route)
//     private readonly routeRepository: Repository<Route>,
//     @InjectRepository(SeatChart)
//     private readonly seatChartRepository: Repository<SeatChart>,
//   ) { }

//   async createConfigFare(data: DTO_RQ_ConfigFare): Promise<DTO_RP_ConfigFare> {
//     console.log('Creating config fare with data:', data);
//     try {
//       const route = await this.routeRepository.findOne({
//         select: [ 'id' ],
//         where: { id: data.route_id },
//       });
//       if (!route) {
//         throw new NotFoundException('Dữ liệu tuyến không tồn tại');
//       }
//       const configFare = this.configFareRepository.create({
//         route_id: route.id,
//         trip_type: data.trip_type,
//         seat_chart_id: data.seat_chart_id,
//         priority: data.priority,
//         double_room: data.double_room,
//         same_price: data.same_price,
//         company_id: data.company_id,
//         config_name: data.config_name,
//         start_date: data.date_range?.[ 0 ],
//         end_date: data.date_range?.[ 1 ],
//       });
//       const savedConfigFare = await this.configFareRepository.save(configFare);
//       if (data.fare_configs?.length) {
//         const fareConfigData = data.fare_configs.map((f) => ({
//           departure_point_id: f.departure_point_id,
//           arrival_point_id: f.arrival_point_id,
//           single_room_price: f.single_room_price,
//           double_room_price: f.double_room_price,
//           config_fare_id: savedConfigFare.id,
//         }));
//         await this.fareConfigRepository
//           .createQueryBuilder()
//           .insert()
//           .into('tbl_fare_config')
//           .values(fareConfigData)
//           .execute();
//         savedConfigFare.fare_configs = await this.fareConfigRepository.find({
//           where: { config_fare_id: savedConfigFare.id },
//         });
//       } else {
//         savedConfigFare.fare_configs = [];
//       }
//       return {
//         id: savedConfigFare.id,
//         route_id: savedConfigFare.route_id,
//         trip_type: savedConfigFare.trip_type,
//         seat_chart_id: savedConfigFare.seat_chart_id,
//         priority: savedConfigFare.priority,
//         double_room: savedConfigFare.double_room,
//         same_price: savedConfigFare.same_price,
//         config_name: savedConfigFare.config_name,
//         date_range: [ savedConfigFare.start_date, savedConfigFare.end_date ] as [
//           Date,
//           Date,
//         ],
//         fare_configs: savedConfigFare.fare_configs,
//       };
//     } catch (error) {
//       console.error('Error creating config fare:', error);
//       throw error;
//     }
//   }

//   async getListConfigFareByCompany(
//     companyId: string,
//   ): Promise<DTO_RP_ConfigFare_3[]> {
//     console.time(`⏱ getListConfigFareByCompany`);
//     try {
//       const configFares = await this.configFareRepository
//         .createQueryBuilder('cf')
//         .leftJoinAndSelect('cf.route', 'r')
//         .leftJoinAndSelect('cf.fare_configs', 'fc')
//         .where('cf.company_id = :companyId', { companyId })
//         .orderBy('cf.route_id', 'ASC')
//         .addOrderBy('cf.id', 'ASC')
//         .getMany();
//       const seatCharts = await this.seatChartRepository.find({
//         select: [ 'id', 'seat_chart_name' ],
//         where: { company_id: companyId },
//       });
//       const seatChartMap = new Map(seatCharts.map(s => [ s.id, s.seat_chart_name ]));
//       const grouped = new Map<number, DTO_RP_ConfigFare_3>();
//       for (const cf of configFares) {
//         const routeId = cf.route_id;
//         if (!grouped.has(routeId)) {
//           grouped.set(routeId, {
//             route_id: routeId,
//             route_name: cf.route?.route_name ?? '',
//             config_fares: [],
//           });
//         }
//         const routeGroup = grouped.get(routeId)!;
//         const seatChartDtos: DTO_RP_ConfigFare_1[] = (cf.seat_chart_id || []).map(id => ({
//           seat_chart_id: id,
//           seat_chart_name: seatChartMap.get(id) ?? '',
//         }));
//         const mappedConfigFare: DTO_RP_ConfigFare_2 = {
//           id: cf.id,
//           route_id: cf.route_id,
//           trip_type: cf.trip_type,
//           seat_chart: seatChartDtos,
//           priority: !!cf.priority,
//           double_room: !!cf.double_room,
//           same_price: !!cf.same_price,
//           config_name: cf.config_name,
//           date_range: [ cf.start_date, cf.end_date ] as [ Date, Date ],
//           fare_configs: cf.fare_configs?.map(
//             (f): FareConfigDto => ({
//               id: f.id,
//               departure_point_id: f.departure_point_id,
//               arrival_point_id: f.arrival_point_id,
//               single_room_price: f.single_room_price,
//               double_room_price: f.double_room_price,
//             }),
//           ) ?? [],
//         };
//         routeGroup.config_fares.push(mappedConfigFare);
//       }
//       console.timeEnd(`⏱ getListConfigFareByCompany`);
//       return Array.from(grouped.values());
//     } catch (error) {
//       console.timeEnd(`⏱ getListConfigFareByCompany`);
//       throw error;
//     }
//   }



//   async deleteConfigFare(configFareId: number): Promise<void> {
//     console.log('Deleting config fare with ID:', configFareId);
//     try {
//       const configFare = await this.configFareRepository.findOne({
//         where: { id: configFareId },
//         select: [ 'id' ],
//       });
//       if (!configFare) {
//         throw new NotFoundException('Config fare not found');
//       }
//       await this.configFareRepository.delete({ id: configFareId });
//     } catch (error) {
//       throw error;
//     }
//   }
//   // async updateConfigFare(
//   //   id: string,
//   //   data: DTO_RQ_ConfigFare,
//   // ): Promise<DTO_RP_ConfigFare> {
//   //   console.log(`Updating config fare ID ${id} with data:`, data);
//   //   try {
//   //     const configFare = await this.configFareRepository.findOne({
//   //       select: [ 'id' ],
//   //       where: { id },
//   //     });
//   //     if (!configFare) {
//   //       throw new NotFoundException('Cấu hình không tồn tại');
//   //     }
//   //     const route = await this.routeRepository.findOne({
//   //       select: [ 'id' ],
//   //       where: { id: data.route_id },
//   //     });
//   //     if (!route) {
//   //       throw new NotFoundException('Tuyến không tồn tại');
//   //     }
//   //     configFare.route_id = route.id;
//   //     configFare.trip_type = data.trip_type;
//   //     configFare.seat_chart_id = data.seat_chart_id;
//   //     configFare.priority = data.priority;
//   //     configFare.double_room = data.double_room;
//   //     configFare.same_price = data.same_price;
//   //     configFare.config_name = data.config_name;
//   //     configFare.start_date = data.date_range?.[ 0 ];
//   //     configFare.end_date = data.date_range?.[ 1 ];

//   //     const updatedConfigFare =
//   //       await this.configFareRepository.save(configFare);

//   //     // Xoá các fare_configs cũ
//   //     await this.fareConfigRepository.delete({ config_fare_id: id });

//   //     // Thêm các fare_configs mới nếu có
//   //     if (data.fare_configs?.length) {
//   //       const fareConfigData = data.fare_configs.map((f) => ({
//   //         departure_point_id: f.departure_point_id,
//   //         arrival_point_id: f.arrival_point_id,
//   //         single_room_price: f.single_room_price,
//   //         double_room_price: f.double_room_price,
//   //         config_fare_id: updatedConfigFare.id,
//   //       }));
//   //       await this.fareConfigRepository
//   //         .createQueryBuilder()
//   //         .insert()
//   //         .into('tbl_fare_config')
//   //         .values(fareConfigData)
//   //         .execute();
//   //     }

//   //     // Lấy lại các fare_configs mới
//   //     updatedConfigFare.fare_configs = await this.fareConfigRepository.find({
//   //       where: { config_fare_id: updatedConfigFare.id },
//   //     });

//   //     return {
//   //       id: updatedConfigFare.id,
//   //       route_id: updatedConfigFare.route_id,
//   //       trip_type: updatedConfigFare.trip_type,
//   //       seat_chart_id: updatedConfigFare.seat_chart_id,
//   //       priority: updatedConfigFare.priority,
//   //       double_room: updatedConfigFare.double_room,
//   //       same_price: updatedConfigFare.same_price,
//   //       config_name: updatedConfigFare.config_name,
//   //       date_range: [
//   //         updatedConfigFare.start_date,
//   //         updatedConfigFare.end_date,
//   //       ] as [ Date, Date ],
//   //       fare_configs: updatedConfigFare.fare_configs,
//   //     };
//   //   } catch (error) {
//   //     throw error;
//   //   }
//   // }
// }
