import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  DTO_RP_ListTrip,
  DTO_RP_UpdateTrip,
  DTO_RQ_GetListTrip,
  DTO_RQ_UpdateTrip,
} from './trip.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, In, Repository } from 'typeorm';
import { Trip } from './trip.entity';
import { Schedule } from '../schedule/schedule.entity';
import { Route } from '../route/route.entity';
import { Ticket } from '../ticket/ticket.entity';
import { Seat } from '../seat/seat.entity';
import { Vehicle } from '../vehicle/vehicle.entity';
import { SeatChart } from '../seat/seat_chart.entity';
import { TripMapper } from './trip.mapper';
import { DTO_RQ_UserAction } from 'src/utils/user.dto';

@Injectable()
export class TripService {
  constructor(
    @InjectRepository(Trip)
    private readonly tripRepository: Repository<Trip>,
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    @InjectRepository(Route)
    private readonly routeRepository: Repository<Route>,
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(SeatChart)
    private readonly seatChartRepository: Repository<SeatChart>,

    private readonly connection: Connection,
  ) {}

  async getListTripByRouteAndDate(
    data: DTO_RQ_GetListTrip,
  ): Promise<DTO_RP_ListTrip[]> {
    const { route, company, date } = data;

    try {
      console.log('Dữ liệu đầu vào:', {
        công_ty: company,
        tuyến_đường: route,
        ngày: date,
      });

      const searchDate = new Date(date);
      if (isNaN(searchDate.getTime())) {
        throw new BadRequestException('Ngày không hợp lệ');
      }

      // Kiểm tra nếu đã có chuyến trong ngày
      console.time('Trip Query Execution Time');
      let existingTrips = await this.tripRepository.find({
        where: {
          route: { id: route },
          company_id: company,
          departure_date: date,
        },
        relations: ['route', 'seat_chart', 'vehicle'],
      });

      if (existingTrips.length > 0) {
        console.log(`Đã có ${existingTrips.length} chuyến trong ngày`);
        console.timeEnd('Trip Query Execution Time');
        console.log(existingTrips);
        return await TripMapper.mapToTripListDTO(existingTrips);
      }

      console.log('Chưa có chuyến nào. Bắt đầu kiểm tra lịch trình');
      const dayOfWeek = this.getDayOfWeek(searchDate);
      const dayNumber = searchDate.getDate();
      const isOddDay = dayNumber % 2 !== 0;

      // Lấy tất cả lịch trình phù hợp với route và company
      const allSchedules = await this.scheduleRepository.find({
        where: {
          route: { id: route },
          company_id: company,
        },
        relations: ['route', 'seat_chart', 'seat_chart.seats'],
      });

      // Lọc lịch trình phù hợp với ngày cụ thể
      const matchedSchedules = allSchedules.filter((schedule) => {
        const startDate = this.normalizeDate(schedule.start_date);
        const endDate = schedule.is_known_end_date
          ? this.normalizeDate(schedule.end_date, true)
          : null;

        // Kiểm tra ngày nằm trong khoảng start_date và end_date
        const isInDateRange =
          searchDate >= startDate && (!endDate || searchDate <= endDate);

        if (!isInDateRange) return false;

        // Kiểm tra các loại lặp lại
        switch (schedule.repeat_type) {
          case 'daily':
            return true;

          case 'weekday':
            const weekdays = this.parseWeekdays(schedule.weekdays);
            return weekdays.includes(dayOfWeek);

          case 'odd_even':
            return (
              (schedule.odd_even_type === 'odd' && isOddDay) ||
              (schedule.odd_even_type === 'even' && !isOddDay)
            );

          default:
            return false;
        }
      });

      if (matchedSchedules.length === 0) {
        throw new NotFoundException('Không tìm thấy lịch trình phù hợp');
      }

      console.log(`Tìm thấy ${matchedSchedules.length} lịch trình phù hợp`);

      // Tạo chuyến từ các lịch trình phù hợp
      const createdTrips = [];
      for (const schedule of matchedSchedules) {
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
          // Tạo chuyến
          const trip = this.tripRepository.create({
            route: schedule.route,
            seat_chart: schedule.seat_chart,
            trip_type: schedule.trip_type,
            departure_time: schedule.start_time,
            departure_date: date,
            company_id: company,
          });

          const savedTrip = await queryRunner.manager.save(trip);

          // Tạo danh sách vé từ sơ đồ ghế
          if (schedule.seat_chart?.seats?.length > 0) {
            const ticketEntities = schedule.seat_chart.seats.map((seat) => {
              return this.ticketRepository.create({
                seat_name: seat.name,
                seat_status: seat.status,
                seat_floor: seat.floor,
                seat_row: seat.row,
                seat_column: seat.column,
                seat_type: seat.type,
                seat_code: seat.code,
                booked_status: false,
                ticket_display_price: schedule.route.base_price,
                company_id: company,
                trip: savedTrip,
              });
            });

            await queryRunner.manager.save(ticketEntities);
            console.log(
              `Đã tạo ${ticketEntities.length} vé cho chuyến ${savedTrip.id}`,
            );
          }

          await queryRunner.commitTransaction();
          createdTrips.push(savedTrip);
        } catch (err) {
          await queryRunner.rollbackTransaction();
          console.error(`Lỗi khi tạo chuyến từ lịch ${schedule.id}:`, err);
          continue;
        } finally {
          await queryRunner.release();
        }
      }

      if (createdTrips.length === 0) {
        throw new NotFoundException(
          'Không thể tạo chuyến từ lịch trình phù hợp',
        );
      }

      existingTrips = await this.tripRepository.find({
        where: {
          id: In(createdTrips.map((t) => t.id)),
        },
        relations: ['route', 'seat_chart', 'vehicle', 'seat_chart.seats'],
      });

      console.timeEnd('Trip Query Execution Time');
      console.log(existingTrips);
      return await TripMapper.mapToTripListDTO(existingTrips);
    } catch (error) {
      console.error('Lỗi trong quá trình xử lý:', {
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  private async createTicketsFromSeats(
    trip: Trip,
    seats: Seat[],
  ): Promise<void> {
    if (!seats || seats.length === 0) {
      console.warn(`Không có ghế nào để tạo vé cho chuyến ${trip.id}`);
      return;
    }

    const ticketEntities = seats.map((seat) => {
      return this.ticketRepository.create({
        seat_name: seat.name,
        seat_status: seat.status,
        seat_floor: seat.floor,
        seat_row: seat.row,
        seat_column: seat.column,
        seat_type: seat.type,
        seat_code: seat.code,
        booked_status: false,
        ticket_display_price: trip.route.base_price,
        company_id: trip.company_id,
        trip: trip,
      });
    });

    try {
      await this.ticketRepository.save(ticketEntities);
      console.log(`Đã tạo ${ticketEntities.length} vé cho chuyến ${trip.id}`);
    } catch (error) {
      console.error(`Lỗi khi tạo vé cho chuyến ${trip.id}:`, error);
      throw new InternalServerErrorException('Có lỗi khi tạo vé');
    }
  }

  private normalizeDate(date: Date, isEndOfDay = false): Date {
    const newDate = new Date(date);
    if (isEndOfDay) {
      newDate.setHours(23, 59, 59, 999);
    } else {
      newDate.setHours(0, 0, 0, 0);
    }
    return newDate;
  }

  private startOfDay(date: Date): Date {
    return this.normalizeDate(date);
  }

  private endOfDay(date: Date): Date {
    return this.normalizeDate(date, true);
  }

  private getDayOfWeek(date: Date): string {
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    return days[date.getDay()];
  }

  private parseWeekdays(weekdays: string | string[]): string[] {
    if (Array.isArray(weekdays)) return weekdays;
    try {
      const cleaned = weekdays.replace(/^[{"\[]|[}"\]]$/g, '');
      return cleaned
        .split(',')
        .map((day) => day.trim().replace(/^"(.*)"$/, '$1'));
    } catch (e) {
      console.error('Lỗi phân tích weekdays:', weekdays);
      return [];
    }
  }

  async updateTripInformation(
    user: DTO_RQ_UserAction,
    data_update: DTO_RQ_UpdateTrip,
    id: number,
  ): Promise<DTO_RP_UpdateTrip> {
    console.log('Update Trip ID:', id);
    console.log('User:', user);
    console.log('Data Update:', data_update);

    // Kiểm tra trip tồn tại
    console.log('\n=== Kiểm tra chuyến đi tồn tại ===');
    const existingTrip = await this.tripRepository.findOne({
      where: { id },
      relations: ['route', 'seat_chart', 'vehicle'],
    });

    if (!existingTrip) {
      console.error('Không tìm thấy chuyến đi với ID:', id);
      throw new NotFoundException('Không tìm thấy chuyến đi');
    }

    // Validation bổ sung
    console.log('\n=== Kiểm tra validation ===');
    if (data_update.seat_chart_id) {
      console.log('Kiểm tra sơ đồ ghế mới:', data_update.seat_chart_id);
      const seatChart = await this.seatChartRepository.findOne({
        where: { id: data_update.seat_chart_id },
      });
      if (!seatChart) {
        console.error('Sơ đồ ghế không tồn tại:', data_update.seat_chart_id);
        throw new BadRequestException('Sơ đồ ghế không tồn tại');
      }
    }

    if (data_update.route_id) {
      console.log('Kiểm tra tuyến đường mới:', data_update.route_id);
      const route = await this.routeRepository.findOne({
        where: { id: data_update.route_id },
      });
      if (!route) {
        console.error('Tuyến đường không tồn tại:', data_update.route_id);
        throw new BadRequestException('Tuyến đường không tồn tại');
      }
    }

    if (data_update.vehicle_id) {
      console.log('Kiểm tra phương tiện mới:', data_update.vehicle_id);
      const vehicle = await this.vehicleRepository.findOne({
        where: { id: data_update.vehicle_id },
      });
      if (!vehicle) {
        console.error('Phương tiện không tồn tại:', data_update.vehicle_id);
        throw new BadRequestException('Phương tiện không tồn tại');
      }
    }

    // Merge data
    console.log('\n=== Merge dữ liệu ===');
    const updatedTrip = this.tripRepository.merge(existingTrip, {
      departure_time: data_update.departure_time,
      note: data_update.note,
      seat_chart: data_update.seat_chart_id
        ? await this.seatChartRepository.findOne({
            where: { id: data_update.seat_chart_id },
          })
        : existingTrip.seat_chart,
      route: data_update.route_id
        ? await this.routeRepository.findOne({
            where: { id: data_update.route_id },
          })
        : existingTrip.route,
      trip_type: data_update.trip_type,
      vehicle: data_update.vehicle_id
        ? await this.vehicleRepository.findOne({
            where: { id: data_update.vehicle_id },
          })
        : existingTrip.vehicle,
    });
    console.log('Dữ liệu chuyến đi sau khi merge:', {
      departure_time: updatedTrip.departure_time,
      note: updatedTrip.note,
      seat_chart_id: updatedTrip.seat_chart?.id || null,
      route_id: updatedTrip.route?.id || null,
      trip_type: updatedTrip.trip_type,
      vehicle_id: updatedTrip.vehicle?.id || null,
    });

    console.log('\n=== Cập nhật tài xế ===');
    if (data_update.driver && data_update.driver.length > 0) {
      console.log('Danh sách tài xế mới:', data_update.driver);
      updatedTrip.driver = data_update.driver.map((d) => ({
        id: d.id,
        name: d.name,
        phone: d.phone,
      })) as any;
    } else {
      console.log('Không có tài xế, set về mảng rỗng');
      updatedTrip.driver = [];
    }

    console.log('\n=== Cập nhật phụ xe ===');
    if (data_update.assistant && data_update.assistant.length > 0) {
      console.log('Danh sách phụ xe mới:', data_update.assistant);
      updatedTrip.assistant = data_update.assistant.map((a) => ({
        id: a.id,
        name: a.name,
        phone: a.phone,
      })) as any;
    } else {
      console.log('Không có phụ xe, set về mảng rỗng');
      updatedTrip.assistant = [];
    }

    try {
      console.log('Lưu chuyến đi đã cập nhật');
      const savedTrip = await this.tripRepository.save(updatedTrip);
      console.log('Lưu thành công:', savedTrip.id);

      const response = {
        id: savedTrip.id,
        departure_time: savedTrip.departure_time,
        route_id: savedTrip.route?.id || null,
        route_name: savedTrip.route?.route_name || '',
        seat_chart_id: savedTrip.seat_chart?.id || null,
        seat_chart_name: savedTrip.seat_chart?.seat_chart_name || '',
        note: savedTrip.note || '',
        trip_type: savedTrip.trip_type,
        vehicle_id: savedTrip.vehicle?.id || null,
        license_plate: savedTrip.vehicle?.license_plate || '',
        vehicle_phone: savedTrip.vehicle?.phone || '',
        assistant: this.mapPersonnel(savedTrip.assistant),
        driver: this.mapPersonnel(savedTrip.driver),
      };

      console.log('Kết quả trả về');
      console.log(JSON.stringify(response, null, 2));

      return response;
    } catch (error) {
      console.error('Lỗi khi truy vấn chuyến đi:', error);
      throw error;
    } finally {
      console.log('Kết thúc quá trình cập nhật');
    }
  }

  private mapPersonnel = (personnel: any) => {
    if (!Array.isArray(personnel)) return [];
    const data = Array.isArray(personnel[0]) ? personnel[0] : personnel;

    return data.map((p: any) => ({
      id: p?.id || '',
      name: p?.name || p?.name || '',
      phone: p?.phone || p?.phone || '',
    }));
  };
}
