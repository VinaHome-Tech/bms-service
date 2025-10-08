import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  DTO_RP_ChangeTimeTrip,
  DTO_RP_ListTrip,
  DTO_RP_UpdateTrip,
  DTO_RQ_ChangeTimeTrip,
  DTO_RQ_GetListTrip,
  DTO_RQ_UpdateTrip,
} from './trip.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, In, Repository } from 'typeorm';
import { Trip } from '../../entities/trip.entity';
import { Schedule } from '../../entities/schedule.entity';
import { SeatChart } from '../../entities/seat_chart.entity';
import { TripMapper } from './trip.mapper';
import { DTO_RQ_UserAction } from 'src/utils/user.dto';
import { TripTicketSummary } from './trip_ticket_summary';
import { DTO_RP_ItemSeat } from '../seat/seat.dto';
import { Route } from 'src/entities/route.entity';
import { Vehicle } from 'src/entities/vehicle.entity';

@Injectable()
export class TripService {
  constructor(
    @InjectRepository(Trip)
    private readonly tripRepository: Repository<Trip>,
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    @InjectRepository(Route)
    private readonly routeRepository: Repository<Route>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(SeatChart)
    private readonly seatChartRepository: Repository<SeatChart>,
    @InjectRepository(TripTicketSummary)
    private readonly tripTicketSummaryRepository: Repository<TripTicketSummary>,

    private readonly connection: Connection,
  ) {}

  // async getListTripByRouteAndDate(
  //   data: DTO_RQ_GetListTrip,
  // ): Promise<DTO_RP_ListTrip[]> {
  //   const startTime = performance.now(); // bắt đầu đo thời gian
  //   try {
  //     const { route, company, date } = data;
  //     const searchDate = new Date(date);
  //     if (isNaN(searchDate.getTime())) {
  //       throw new BadRequestException('Ngày không hợp lệ');
  //     }

  //     const allSchedules = await this.scheduleRepository.find({
  //       where: { route: { id: route }, company_id: company },
  //       relations: ['route', 'seat_chart', 'seat_chart.seats'],
  //     });

  //     console.log('Tổng số schedules tìm được:', allSchedules.length);

  //     const dayOfWeek = this.getDayOfWeek(searchDate);
  //     const dayNumber = searchDate.getDate();
  //     const isOddDay = dayNumber % 2 !== 0;

  //     const matchedSchedules = allSchedules.filter((schedule) => {
  //       const startDate = this.normalizeDate(schedule.start_date);
  //       const endDate = schedule.is_known_end_date
  //         ? this.normalizeDate(schedule.end_date, true)
  //         : null;

  //       const inDateRange =
  //         searchDate >= startDate && (!endDate || searchDate <= endDate);
  //       if (!inDateRange) return false;

  //       switch (schedule.repeat_type) {
  //         case 'daily':
  //           return true;
  //         case 'weekday':
  //           const weekdays = this.parseWeekdays(schedule.weekdays);
  //           return weekdays.includes(dayOfWeek);
  //         case 'odd_even':
  //           return (
  //             (schedule.odd_even_type === 'odd' && isOddDay) ||
  //             (schedule.odd_even_type === 'even' && !isOddDay)
  //           );
  //         default:
  //           return false;
  //       }
  //     });
  //     console.log(`Schedule phù hợp ngày ${date}:`, matchedSchedules.length);

  //     for (const schedule of matchedSchedules) {
  //       const tripExists = await this.tripRepository.findOne({
  //         where: {
  //           schedule: { id: schedule.id },
  //           departure_date: date,
  //           company_id: company,
  //         },
  //       });

  //       if (!tripExists) {
  //         const newTrip = this.tripRepository.create({
  //           route: schedule.route,
  //           seat_chart: schedule.seat_chart,
  //           trip_type: schedule.trip_type,
  //           departure_time: schedule.start_time,
  //           departure_date: date,
  //           company_id: company,
  //           schedule: schedule,
  //         });

  //         const savedTrip = await this.tripRepository.save(newTrip);
  //         const newTripTicketSummary = this.tripTicketSummaryRepository.create({
  //           trip: savedTrip,
  //           total_tickets: schedule.seat_chart?.total_seat || 0,
  //           booked_tickets: 0,
  //         });
  //         await this.tripTicketSummaryRepository.save(newTripTicketSummary);

  //         // Tạo tickets từ seat_chart
  //         if (schedule.seat_chart?.seats?.length > 0) {
  //           const tickets = schedule.seat_chart.seats.map((seat) =>
  //             this.ticketRepository.create({
  //               seat_name: seat.name,
  //               seat_status: seat.status,
  //               seat_floor: seat.floor,
  //               seat_row: seat.row,
  //               seat_column: seat.column,
  //               seat_type: seat.type,
  //               seat_code: seat.code,
  //               booked_status: false,
  //               ticket_display_price: schedule.route.base_price,
  //               company_id: company,
  //               trip: savedTrip,
  //             }),
  //           );
  //           await this.ticketRepository.save(tickets);
  //           console.log(`Đã tạo ${tickets.length} vé cho trip ${savedTrip.id}`);
  //         }

  //         console.log(`Đã tạo trip mới từ schedule ${schedule.id}`);
  //       }
  //     }

  //     const tripsInDay = await this.tripRepository.find({
  //       where: {
  //         route: { id: route },
  //         company_id: company,
  //         departure_date: date,
  //       },
  //       relations: [
  //         'route',
  //         'seat_chart',
  //         'vehicle',
  //         'seat_chart.seats',
  //         'schedule',
  //         'ticket_summary',
  //       ],
  //     });

  //     console.log(`Tổng chuyến trong ngày ${date}:`, tripsInDay.length);

  //     const result = await TripMapper.mapToTripListDTO(tripsInDay);

  //     const endTime = performance.now(); // kết thúc đo
  //     console.log(
  //       `⏱ Thời gian thực hiện: ${(endTime - startTime).toFixed(2)} ms`,
  //     );

  //     return result;
  //   } catch (error) {
  //     console.error('❌ Lỗi khi lấy danh sách trip theo route và date:', error);

  //     // Nếu là lỗi có thể đoán trước (BadRequest, NotFound, ...)
  //     if (
  //       error instanceof BadRequestException ||
  //       error instanceof NotFoundException
  //     ) {
  //       throw error;
  //     }

  //     // Các lỗi không xác định
  //     throw new Error('Đã xảy ra lỗi không xác định khi lấy danh sách trip');
  //   }
  // }

  async changeTimeTrip(
    data_update: DTO_RQ_ChangeTimeTrip,
    id: number,
  ): Promise<DTO_RP_ChangeTimeTrip> {
    const trip = await this.tripRepository.findOne({ where: { id } });
    if (!trip) {
      throw new NotFoundException('Dữ liệu chuyến đi không tồn tại');
    }

    trip.departure_time = data_update.departure_time;
    await this.tripRepository.save(trip);
    return {
      trip_id: trip.id,
      departure_time: trip.departure_time,
    };
  }

  async deleteTrip(id: number): Promise<void> {
    const trip = await this.tripRepository.findOne({ where: { id } });
    if (!trip) {
      throw new NotFoundException('Chuyến đi không tồn tại');
    }

    try {
      await this.tripRepository.softDelete(id); // xoá mềm
    } catch (error) {
      console.error('Lỗi khi xoá chuyến đi:', error);
      throw new InternalServerErrorException('Có lỗi khi xoá chuyến đi');
    }
  }

  async confirmationDepart(id: number): Promise<void> {
    const result = await this.tripRepository.update(
      { id },
      { confirmation_depart: true },
    );

    if (result.affected === 0) {
      throw new NotFoundException('Chuyến đi không tồn tại');
    }
  }

  async updateNote(id: number, note: string): Promise<string> {
    const result = await this.tripRepository.update({ id }, { note });

    if (result.affected === 0) {
      throw new NotFoundException('Chuyến đi không tồn tại');
    }

    return note;
  }

  // BM-17 Get List Trip By Route And Date
  async getListTripByRouteAndDate(
    data: DTO_RQ_GetListTrip,
  ): Promise<DTO_RP_ListTrip[]> {
    console.time('⏱️ getListTripByRouteAndDate');
    try {
      const { route, company, date } = data;
      const searchDate = new Date(date);

      if (isNaN(searchDate.getTime())) {
        throw new BadRequestException('Ngày không hợp lệ');
      }

      console.time('🔹 Query schedules');
      const allSchedules = await this.scheduleRepository
        .createQueryBuilder('schedule')
        .leftJoinAndSelect('schedule.route', 'route')
        .leftJoinAndSelect('schedule.seat_chart', 'seat_chart')
        .where('schedule.company_id = :company', { company })
        .andWhere('route.id = :route', { route })
        .select([
          'schedule.id',
          'schedule.weekdays',
          'schedule.start_date',
          'schedule.end_date',
          'schedule.start_time',
          'schedule.repeat_type',
          'schedule.odd_even_type',
          'schedule.is_known_end_date',
          'schedule.trip_type',
          'route.id',
          'route.base_price',
          'seat_chart.id',
          'seat_chart.total_seat',
        ])
        .getMany();
      console.timeEnd('🔹 Query schedules');
      console.log('✅ allSchedules:', allSchedules.length);

      const dayOfWeek = this.getDayOfWeek(searchDate);
      const dayNumber = searchDate.getDate();
      const isOddDay = dayNumber % 2 !== 0;

      console.time('🔹 Filter schedules');
      const matchedSchedules = allSchedules.filter((schedule) => {
        if (!schedule.start_date) return false;
        const startDate = this.normalizeDate(schedule.start_date);
        const endDate =
          schedule.is_known_end_date && schedule.end_date
            ? this.normalizeDate(schedule.end_date, true)
            : null;

        const inDateRange =
          searchDate >= startDate && (!endDate || searchDate <= endDate);
        if (!inDateRange) return false;

        switch (schedule.repeat_type) {
          case 'daily':
            return true;
          case 'weekday': {
            const weekdays = this.parseWeekdays(schedule.weekdays);
            return weekdays.includes(dayOfWeek);
          }
          case 'odd_even':
            return (
              (schedule.odd_even_type === 'odd' && isOddDay) ||
              (schedule.odd_even_type === 'even' && !isOddDay)
            );
          default:
            return false;
        }
      });
      console.timeEnd('🔹 Filter schedules');
      console.log('✅ matchedSchedules:', matchedSchedules.length);

      if (!matchedSchedules.length) {
        console.warn('⚠️ Không có schedule nào khớp với ngày này.');
        return [];
      }

      console.time('🔹 Query existing trips');
      const existingTrips = await this.tripRepository.find({
        where: {
          company_id: company,
          departure_date: date,
          schedule: In(matchedSchedules.map((s) => s.id)),
        },
        select: {
          id: true,
          schedule: { id: true },
        },
        relations: ['schedule'],
        withDeleted: true,
      });
      console.timeEnd('🔹 Query existing trips');
      console.log('✅ existingTrips:', existingTrips.length);

      const existingTripScheduleIds = new Set(
        existingTrips.map((t) => t.schedule.id),
      );

      console.time('🔹 Create new trips');
      const newTrips = matchedSchedules
        .filter((s) => !existingTripScheduleIds.has(s.id))
        .map((schedule) =>
          this.tripRepository.create({
            route: schedule.route,
            seat_chart: schedule.seat_chart,
            trip_type: schedule.trip_type,
            departure_time: schedule.start_time,
            departure_date: date,
            company_id: company,
            schedule: schedule,
            ticket_price: schedule.route.base_price,
          }),
        );

      const savedTrips = newTrips.length
        ? await this.tripRepository.save(newTrips)
        : [];
      console.timeEnd('🔹 Create new trips');
      console.log('✅ newTrips:', savedTrips.length);

      if (savedTrips.length > 0) {
        console.time('🔹 Save ticket summaries');
        const newSummaries = savedTrips.map((trip) => {
          const schedule = matchedSchedules.find(
            (s) => s.id === trip.schedule.id,
          );
          return this.tripTicketSummaryRepository.create({
            trip,
            total_tickets: schedule?.seat_chart?.total_seat || 0,
            booked_tickets: 0,
            total_tickets_price: 0,
          });
        });
        await this.tripTicketSummaryRepository.save(newSummaries);
        console.timeEnd('🔹 Save ticket summaries');
        console.log('✅ ticketSummaries:', newSummaries.length);
      }

      // --- Cập nhật tạm thời có thể comment lại để debug ---
      // console.time('🔹 Update existing trip summaries');
      // await Promise.all(
      //   existingTrips.map(async (trip) => {
      //     const schedule = matchedSchedules.find(
      //       (s) => s.id === trip.schedule.id,
      //     );
      //     if (!schedule) return;

      //     try {
      //       const [bookedCount, totalTicketsPrice] = await Promise.all([
      //         this.updateBookedTicketsFromExternalAPI(trip.id),
      //         this.updateTotalTicketsPriceFromExternalAPI(trip.id),
      //       ]);

      //       await this.tripTicketSummaryRepository.update(
      //         { trip: { id: trip.id } },
      //         {
      //           total_tickets: schedule?.seat_chart?.total_seat || 0,
      //           booked_tickets: bookedCount || 0,
      //           total_tickets_price: totalTicketsPrice || 0,
      //         },
      //       );
      //     } catch (e) {
      //       console.error(`⚠️ Lỗi khi cập nhật trip #${trip.id}:`, e.message);
      //     }
      //   }),
      // );
      // console.timeEnd('🔹 Update existing trip summaries');

      console.time('🔹 Query trips in day');
      const tripsInDay = await this.tripRepository
        .createQueryBuilder('trip')
        .leftJoin('trip.route', 'route')
        .leftJoin('trip.seat_chart', 'seat_chart')
        .leftJoin('trip.vehicle', 'vehicle')
        .leftJoin('trip.schedule', 'schedule')
        .leftJoin('trip.ticket_summary', 'ticket_summary')
        .where('trip.route_id = :route', { route })
        .andWhere('trip.company_id = :company', { company })
        .andWhere('trip.departure_date = :date', { date })
        .andWhere('trip.deleted_at IS NULL')
        .select([
          'trip.id',
          'trip.departure_date',
          'trip.departure_time',
          'trip.trip_type',
          'trip.note',
          'trip.driver',
          'trip.assistant',
          'trip.confirmation_depart',
          'trip.ticket_price',
          'vehicle.id',
          'vehicle.phone',
          'vehicle.license_plate',
          'route.id',
          'route.route_name',
          'seat_chart.id',
          'seat_chart.seat_chart_name',
          'ticket_summary.booked_tickets',
          'ticket_summary.total_tickets',
          'ticket_summary.total_tickets_price',
        ])
        .getMany();
      console.timeEnd('🔹 Query trips in day');
      console.log('✅ tripsInDay:', tripsInDay.length);

      console.time('🔹 Map trips to DTO');
      const result = await TripMapper.mapToTripListDTO(tripsInDay);
      console.timeEnd('🔹 Map trips to DTO');

      console.timeEnd('⏱️ getListTripByRouteAndDate');
      console.log('✅ Final result length:', result.length);
      return result;
    } catch (error) {
      console.timeEnd('⏱️ getListTripByRouteAndDate');
      console.error('❌ Lỗi khi lấy danh sách trip theo route và date:', error);
      throw new InternalServerErrorException(
        'Có lỗi khi lấy danh sách chuyến đi',
      );
    }
  }

  private async updateBookedTicketsFromExternalAPI(
    tripId: number,
  ): Promise<number> {
    try {
      const url = `http://host.docker.internal:3002/v4-1/bus-ticket/booked-count/${tripId}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new InternalServerErrorException(
          `HTTP error! status: ${response.status}`,
        );
      }
      const data = await response.json();
      const bookedCount = data.booked_count ?? data.result ?? 0;
      return bookedCount;
    } catch (error) {
      throw new InternalServerErrorException(
        `Lỗi khi gọi API external cho trip ${tripId}: ${error.message}`,
      );
    }
  }
  private async updateTotalTicketsPriceFromExternalAPI(
    tripId: number,
  ): Promise<number> {
    try {
      const url = `http://host.docker.internal:3002/v4-1/bus-ticket/calculate-total-tickets-price/${tripId}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new InternalServerErrorException(
          `HTTP error! status: ${response.status}`,
        );
      }
      const data = await response.json();
      const totalTicketsPrice = data.total_price ?? data.result ?? 0;
      return totalTicketsPrice;
    } catch (error) {
      throw new InternalServerErrorException(
        `Lỗi khi gọi API external cho trip ${tripId}: ${error.message}`,
      );
    }
  }

  // BM-38 Update Tickets Booked In Trip
  async updateTicketsBookedInTrip(
    id: number,
    data: { tickets_booked: number; total_tickets_price: number },
  ): Promise<void> {
    const summary = await this.tripTicketSummaryRepository.findOne({
      where: { trip: { id } },
    });

    if (!summary) {
      throw new NotFoundException('Không tìm thấy dữ liệu chuyến');
    }

    summary.booked_tickets = data.tickets_booked;
    summary.total_tickets_price = data.total_tickets_price;

    await this.tripTicketSummaryRepository.save(summary);
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

  // BM-37 Get List Seat By Trip
  async getListSeatByTrip(id: number): Promise<DTO_RP_ItemSeat[]> {
    try {
      const seats = await this.tripRepository
        .createQueryBuilder('trip')
        .innerJoin('trip.seat_chart', 'seatChart')
        .innerJoin('seatChart.seats', 'seat')
        .innerJoin('trip.route', 'route')
        .where('trip.id = :id', { id })
        .select([
          'seat.id',
          'seat.code',
          'seat.name',
          'seat.status',
          'seat.floor',
          'seat.row',
          'seat.column',
          'seat.type',
          'route.base_price',
          'trip.company_id',
          'trip.departure_date',
          'trip.departure_time',
          'route.id',
          'route.route_name AS route_name',
        ])
        .getRawMany();

      if (!seats || seats.length === 0) {
        throw new NotFoundException(
          'Chuyến đi không tồn tại hoặc chưa có sơ đồ ghế',
        );
      }

      const result: DTO_RP_ItemSeat[] = seats.map((raw) => ({
        id: Number(raw.seat_id),
        code: raw.seat_code,
        name: raw.seat_name,
        status: raw.seat_status,
        floor: Number(raw.seat_floor),
        row: Number(raw.seat_row),
        column: Number(raw.seat_column),
        type: Number(raw.seat_type),
        base_price: Number(raw.route_base_price),
        company_id: raw.trip_company_id,
        route_id: Number(raw.route_id),
        route_name: raw.route_name,
        departure_date: raw.trip_departure_date,
        departure_time: raw.trip_departure_time,
      }));

      return result;
    } catch (error) {
      console.error('❌ Error in getListSeatByTrip:', {
        tripId: id,
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }
}
