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
  EmployeeItem,
} from './trip.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from '../company/company.entity';
import { Between, Repository } from 'typeorm';
import { Trip } from './trip.entity';
import { Schedule } from '../schedule/schedule.entity';
import { Route } from '../route/route.entity';
import { Ticket } from '../ticket/ticket.entity';
import { Seat } from '../seat/seat.entity';
import { Vehicle } from '../vehicle/vehicle.entity';
import { SeatChart } from '../seat/seat_chart.entity';

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
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(SeatChart)
    private readonly seatChartRepository: Repository<SeatChart>,
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
        // where: { id: data.route, company: { id: data.company } },
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
          'vehicle',
        ],
      });

      if (existingTrips.length > 0) {
        console.log(
          `✅ Đã có ${existingTrips.length} chuyến trong ngày. Trả về danh sách chuyến`,
        );
        console.log(existingTrips);
        return this.mapToTripDTOs(existingTrips);
      }

      console.log(
        '⚠️ Chưa có chuyến nào. Bắt đầu kiểm tra lịch trình để tạo mới',
      );

      const dayOfWeek = this.getDayOfWeek(searchDate);
      const dayNumber = searchDate.getDate();
      const isOddDay = dayNumber % 2 !== 0;

      const allSchedules = await this.scheduleRepository.find({
        // where: { route: { id: data.route }, company: { id: data.company } },
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
            relations: ['tickets', 'seat_chart', 'route', 'company', 'vehicle'],
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

      const processEmployeeData = (employeeData: any): EmployeeItem[] => {
        if (!employeeData) return [];

        try {
          let parsedData =
            typeof employeeData === 'string'
              ? JSON.parse(employeeData)
              : employeeData;

          // Handle double-nested array case '[[{...}]]'
          if (
            Array.isArray(parsedData) &&
            parsedData.length > 0 &&
            Array.isArray(parsedData[0])
          ) {
            parsedData = parsedData[0];
          }
          const employees = Array.isArray(parsedData)
            ? parsedData
            : [parsedData];
          return employees
            .map((emp: any) => ({
              id: emp?.id?.toString() || '',
              full_name: emp?.full_name?.toString() || '',
              number_phone: emp?.number_phone?.toString() || '',
            }))
            .filter((emp) => emp.id || emp.full_name || emp.number_phone);
        } catch (e) {
          console.error('Error parsing employee data:', e);
          return [];
        }
      };

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
        vehicle_id: trip.vehicle?.id || null,
        license_plate: trip.vehicle?.license_plate || '',
        driver: processEmployeeData(trip.driver),
        assistant: processEmployeeData(trip.assistant),
        note: trip.note || '',
        vehicle_phone: trip.vehicle?.phone || '',
        total_fare: validTickets
          .filter((ticket) => ticket.booked_status === true)
          .reduce((sum, ticket) => sum + ticket.ticket_display_price, 0),
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

  async updateTripInformation(
    data: DTO_RQ_UpdateTrip,
    id: number,
  ): Promise<DTO_RP_UpdateTrip> {
    console.log('=== Bắt đầu cập nhật chuyến đi ===');
    console.log('ID chuyến đi:', id);
    console.log('Dữ liệu đầu vào:', JSON.stringify(data, null, 2));

    // Kiểm tra trip tồn tại
    console.log('\n=== Kiểm tra chuyến đi tồn tại ===');
    const existingTrip = await this.tripRepository.findOne({
      where: { id },
      relations: ['route', 'seat_chart', 'company', 'vehicle'],
    });

    if (!existingTrip) {
      console.error('Không tìm thấy chuyến đi với ID:', id);
      throw new NotFoundException('Không tìm thấy chuyến đi');
    }

    // Validation bổ sung
    console.log('\n=== Kiểm tra validation ===');
    if (data.seat_chart_id) {
      console.log('Kiểm tra sơ đồ ghế mới:', data.seat_chart_id);
      const seatChart = await this.seatChartRepository.findOne({
        where: { id: data.seat_chart_id },
      });
      if (!seatChart) {
        console.error('Sơ đồ ghế không tồn tại:', data.seat_chart_id);
        throw new BadRequestException('Sơ đồ ghế không tồn tại');
      }
    }

    if (data.route_id) {
      console.log('Kiểm tra tuyến đường mới:', data.route_id);
      const route = await this.routeRepository.findOne({
        where: { id: data.route_id },
      });
      if (!route) {
        console.error('Tuyến đường không tồn tại:', data.route_id);
        throw new BadRequestException('Tuyến đường không tồn tại');
      }
    }

    if (data.vehicle_id) {
      console.log('Kiểm tra phương tiện mới:', data.vehicle_id);
      const vehicle = await this.vehicleRepository.findOne({
        where: { id: data.vehicle_id },
      });
      if (!vehicle) {
        console.error('Phương tiện không tồn tại:', data.vehicle_id);
        throw new BadRequestException('Phương tiện không tồn tại');
      }
    }

    // Merge data
    console.log('\n=== Merge dữ liệu ===');
    const updatedTrip = this.tripRepository.merge(existingTrip, {
      departure_time: data.departure_time,
      note: data.note,
      seat_chart: data.seat_chart_id
        ? await this.seatChartRepository.findOne({
            where: { id: data.seat_chart_id },
          })
        : existingTrip.seat_chart,
      route: data.route_id
        ? await this.routeRepository.findOne({
            where: { id: data.route_id },
          })
        : existingTrip.route,
      trip_type: data.trip_type,
      vehicle: data.vehicle_id
        ? await this.vehicleRepository.findOne({
            where: { id: data.vehicle_id },
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
    if (data.driver && data.driver.length > 0) {
      console.log('Danh sách tài xế mới:', data.driver);
      updatedTrip.driver = [
        data.driver.map((d) => ({
          id: d.id,
          full_name: d.full_name,
          number_phone: d.number_phone,
        })),
      ];
    } else {
      console.log('Không có tài xế, set về mảng rỗng');
      updatedTrip.driver = [];
    }

    console.log('\n=== Cập nhật phụ xe ===');
    if (data.assistant && data.assistant.length > 0) {
      console.log('Danh sách phụ xe mới:', data.assistant);
      updatedTrip.assistant = [
        data.assistant.map((a) => ({
          id: a.id,
          full_name: a.full_name,
          number_phone: a.number_phone,
        })),
      ];
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
      full_name: p?.full_name || '',
      number_phone: p?.number_phone || '',
    }));
  };
}
