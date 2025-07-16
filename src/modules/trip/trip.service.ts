import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DTO_RP_ListTrip, DTO_RQ_GetListTrip } from './trip.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from '../company/company.entity';
import { Between, Repository } from 'typeorm';
import { Trip } from './trip.entity';
import { Schedule } from '../schedule/schedule.entity';
import { Route } from '../route/route.entity';
import { Ticket } from '../ticket/ticket.entity';
import { Seat } from '../seat/seat.entity';

@Injectable()
export class TripService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(Trip)
    private readonly tripRepository: Repository<Trip>,
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    @InjectRepository(Route)
    private readonly routeRepository: Repository<Route>,
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
  ) {}

  async getListTripByRouteAndDate(
    data: DTO_RQ_GetListTrip,
  ): Promise<DTO_RP_ListTrip[]> {
    console.log(
      '================================================================================',
    );
    console.log('Dữ liệu đầu vào:', {
      công_ty: data.company,
      tuyến_đường: data.route,
      ngày: data.date,
    });

    try {
      const searchDate = new Date(data.date);
      if (isNaN(searchDate.getTime())) {
        throw new BadRequestException('Ngày không hợp lệ');
      }
      const existingCompany = await this.companyRepository.findOne({
        where: { id: data.company },
      });
      if (!existingCompany) {
        throw new NotFoundException('Công ty không tồn tại');
      }
      const existingRoute = await this.routeRepository.findOne({
        where: { id: data.route, company: { id: data.company } },
        relations: ['company'],
      });
      if (!existingRoute) {
        throw new NotFoundException('Tuyến đường không tồn tại');
      }
      const existingTrips = await this.tripRepository.find({
        where: {
          route: { id: data.route },
          company: { id: data.company },
          departure_date: Between(
            this.startOfDay(searchDate),
            this.endOfDay(searchDate),
          ),
        },
        relations: [
          'route',
          'company',
          'seat_chart',
          'seat_chart.seats',
          'tickets',
        ],
      });

      if (existingTrips.length > 0) {
        console.log(
          `✅ Đã có ${existingTrips.length} chuyến trong ngày. Trả về danh sách chuyến`,
        );
        return this.mapToTripDTOs(existingTrips);
      }

      console.log(
        '⚠️ Chưa có chuyến nào. Bắt đầu kiểm tra lịch trình để tạo mới',
      );

      const dayOfWeek = this.getDayOfWeek(searchDate);
      const dayNumber = searchDate.getDate();
      const isOddDay = dayNumber % 2 !== 0;

      const allSchedules = await this.scheduleRepository.find({
        where: { route: { id: data.route }, company: { id: data.company } },
        relations: ['company', 'route', 'seat_chart', 'seat_chart.seats'],
      });

      const matchedSchedules = allSchedules.filter((schedule) => {
        const startDate = this.normalizeDate(schedule.start_date);
        const endDate = schedule.is_known_end_date
          ? this.normalizeDate(schedule.end_date, true)
          : null;

        const isInDateRange =
          searchDate >= startDate && (!endDate || searchDate <= endDate);

        if (!isInDateRange) return false;

        if (schedule.repeat_type === 'weekday') {
          const weekdays = this.parseWeekdays(schedule.weekdays);
          return weekdays.includes(dayOfWeek);
        } else if (schedule.repeat_type === 'odd_even') {
          return (
            (schedule.odd_even_type === 'odd' && isOddDay) ||
            (schedule.odd_even_type === 'even' && !isOddDay)
          );
        }

        return false;
      });

      console.log(`✅ Tìm thấy ${matchedSchedules.length} lịch trình phù hợp`);

      if (matchedSchedules.length === 0) {
        throw new NotFoundException('Không tìm thấy lịch trình phù hợp');
      }

      const createdTrips: Trip[] = [];
      for (const schedule of matchedSchedules) {
        const existingTrip = await this.tripRepository.findOne({
          where: {
            route: { id: existingRoute.id },
            company: { id: existingCompany.id },
            departure_date: Between(
              this.startOfDay(searchDate),
              this.endOfDay(searchDate),
            ),
            departure_time: schedule.start_time,
          },
        });

        if (existingTrip) {
          console.log(`Chuyến đã tồn tại: ${existingTrip.id}`);
          createdTrips.push(existingTrip);
          continue;
        }

        const newTrip = this.tripRepository.create({
          departure_date: searchDate,
          departure_time: schedule.start_time,
          trip_type: schedule.trip_type,
          seat_chart: schedule.seat_chart,
          company: existingCompany,
          route: existingRoute,
        });

        try {
          // 1. Lưu chuyến đi trước
          const savedTrip = await this.tripRepository.save(newTrip);
          console.log(`Đã tạo chuyến mới: ${savedTrip.id}`);

          // 2. Tạo vé và ĐỢI cho đến khi hoàn thành
          await this.createTicketsFromSeats(
            savedTrip,
            schedule.seat_chart.seats,
          );

          // 3. Load lại chuyến đi với đầy đủ thông tin vé
          const fullTrip = await this.tripRepository.findOne({
            where: { id: savedTrip.id },
            relations: ['tickets', 'seat_chart', 'route', 'company'],
          });

          if (!fullTrip) {
            throw new Error('Không thể load lại thông tin chuyến đi');
          }

          createdTrips.push(fullTrip);
          console.log('Chuyến đi sau khi tạo vé:', {
            tripId: fullTrip.id,
            ticketCount: fullTrip.tickets?.length,
          });
        } catch (error) {
          console.error(`Lỗi khi tạo chuyến từ lịch ${schedule.id}:`, error);
          throw new InternalServerErrorException('Có lỗi khi tạo chuyến mới');
        }
      }

      if (createdTrips.length === 0) {
        throw new NotFoundException(
          'Không thể tạo chuyến từ lịch trình phù hợp',
        );
      }
      return this.mapToTripDTOs(createdTrips);
    } catch (error) {
      console.error('Lỗi trong quá trình xử lý:', error);
      throw error;
    }
  }

  private mapToTripDTOs(trips: Trip[]): DTO_RP_ListTrip[] {
    return trips.map((trip) => {
      const tickets = trip.tickets || [];
      const validTickets = tickets.filter(
        (ticket) => ticket.seat_name && ticket.seat_name.trim() !== '',
      );

      return {
        id: trip.id,
        departure_date: trip.departure_date,
        departure_time: trip.departure_time,
        seat_chart_id: trip.seat_chart?.id || null,
        seat_chart_name: trip.seat_chart?.seat_chart_name || '',
        route_id: trip.route?.id || null,
        route_name: trip.route?.route_name || '',
        trip_type: trip.trip_type,
        tickets_booked: validTickets.filter((t) => t.booked_status).length,
        total_ticket: validTickets.length,
      };
    });
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
        company: trip.company,
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
}
