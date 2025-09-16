import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from './ticket.entity';
import { Repository, In } from 'typeorm';
import { Trip } from '../trip/trip.entity';
import {
  DTO_RP_ListCustomerByTrip,
  DTO_RP_ListTransitDownByTrip,
  DTO_RP_ListTransitUpByTrip,
  DTO_RP_SearchTicket,
  DTO_RP_Ticket,
  DTO_RP_TicketsToPrint,
  DTO_RQ_CancelTicket,
  DTO_RQ_CopyTicket,
  DTO_RQ_MoveTicket,
  DTO_RQ_TicketPayloadUpdate,
  DTO_RQ_UserChooserTicket,
} from './ticket.dto';
import { DTO_RQ_UserAction } from 'src/utils/user.dto';
import { Office } from '../office/office.entity';
import { TicketMapper } from './ticket.mapper';
import { SeatChart } from '../seat/seat_chart.entity';
import { Seat } from '../seat/seat.entity';
import { Schedule } from '../schedule/schedule.entity';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(Trip)
    private readonly tripRepository: Repository<Trip>,
    @InjectRepository(Office)
    private readonly officeRepository: Repository<Office>,
    @InjectRepository(SeatChart)
    private readonly seatChartRepository: Repository<SeatChart>,
    @InjectRepository(Seat)
    private readonly seatRepository: Repository<Seat>,
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  // async getListTicketsByTrip(id: number): Promise<DTO_RP_Ticket[]> {
  //   const start = Date.now();
  //   console.log('----------------');
  //   console.log(`getListTicketsByTrip START tripId=${id}`);

  //   try {
  //     const trip = await this.tripRepository
  //       .createQueryBuilder('trip')
  //       .leftJoin('trip.schedule', 'schedule')
  //       .select(['trip.id', 'trip.trip_type', 'trip.company_id', 'schedule.id'])
  //       .where('trip.id = :id', { id })
  //       .getOne();

  //     if (!trip) {
  //       throw new NotFoundException('Chuyến không tồn tại');
  //     }

  //     let tickets = await this.ticketRepository.find({
  //       where: { trip: { id: trip.id } },
  //       select: [
  //         'id',
  //         'seat_name',
  //         'seat_status',
  //         'seat_floor',
  //         'seat_row',
  //         'seat_column',
  //         'seat_type',
  //         'seat_code',
  //         'booked_status',
  //         'ticket_phone',
  //         'ticket_email',
  //         'ticket_customer_name',
  //         'ticket_point_up',
  //         'ticket_point_down',
  //         'ticket_note',
  //         'ticket_display_price',
  //         'payment_method',
  //         'user_created',
  //         'user_id_created',
  //         'office',
  //         'contact_status',
  //         'transit_up',
  //         'transit_down',
  //       ],
  //     });
  //     console.log(`Existing tickets count=${tickets.length}`);

  //     if (trip.trip_type === 1 || trip.trip_type === 3) {
  //       if (tickets.length > 0) {
  //         console.log(`DONE in ${Date.now() - start}ms`);
  //         return TicketMapper.mapToTicketDTO(tickets);
  //       }

  //       const schedule = await this.scheduleRepository
  //         .createQueryBuilder('schedule')
  //         .leftJoin('schedule.seat_chart', 'seat_chart')
  //         .leftJoin('schedule.route', 'route')
  //         .select(['schedule.id', 'seat_chart.id', 'route.base_price'])
  //         .where('schedule.id = :id', { id: trip.schedule?.id })
  //         .getOne();
  //       console.log('schedule:', schedule);

  //       if (!schedule) {
  //         throw new NotFoundException('Không tìm thấy lịch cho chuyến này');
  //       }
  //       if (!schedule.seat_chart) {
  //         throw new NotFoundException(
  //           'Không tìm thấy sơ đồ ghế cho chuyến này',
  //         );
  //       }

  //       const seats = await this.seatRepository.find({
  //         where: { seat_chart: { id: schedule.seat_chart.id } },
  //         select: [
  //           'id',
  //           'code',
  //           'name',
  //           'status',
  //           'floor',
  //           'row',
  //           'column',
  //           'type',
  //         ],
  //       });
  //       console.log('seats:', seats.length);

  //       if (seats.length === 0) {
  //         console.warn('Seat chart has no seats');
  //         throw new NotFoundException('Sơ đồ ghế không có ghế nào');
  //       }

  //       const newTicketEntities = seats.map((seat) =>
  //         this.ticketRepository.create({
  //           seat_name: seat.name,
  //           seat_status: seat.status,
  //           seat_floor: seat.floor,
  //           seat_row: seat.row,
  //           seat_column: seat.column,
  //           seat_type: seat.type,
  //           seat_code: seat.code,
  //           booked_status: false,
  //           ticket_display_price: schedule.route?.base_price ?? 0,
  //           company_id: trip.company_id,
  //           trip: { id: trip.id } as any,
  //         }),
  //       );

  //       tickets = await this.ticketRepository.save(newTicketEntities);
  //       console.log(`Saved ${tickets.length} tickets`);
  //       console.log(`DONE in ${Date.now() - start}ms`);
  //       return TicketMapper.mapToTicketDTO(tickets);
  //     }

  //     console.log(`DONE in ${Date.now() - start}ms`);
  //     return null;
  //   } catch (err) {
  //     console.error(`ERROR: ${err?.message}`, err?.stack);
  //     throw err;
  //   }
  // }
  async getListTicketsByTrip(id: number): Promise<DTO_RP_Ticket[]> {
    const start = Date.now();
    console.log('----------------');
    console.log(`getListTicketsByTrip START tripId=${id}`);

    try {
      const trip = await this.tripRepository
        .createQueryBuilder('trip')
        .leftJoinAndSelect('trip.schedule', 'schedule')
        .leftJoinAndSelect('schedule.seat_chart', 'seat_chart')
        .leftJoinAndSelect('schedule.route', 'route')
        .select([
          'trip.id',
          'trip.trip_type',
          'trip.company_id',
          'schedule.id',
          'seat_chart.id',
          'route.base_price',
        ])
        .where('trip.id = :id', { id })
        .getOne();

      if (!trip) {
        throw new NotFoundException('Chuyến không tồn tại');
      }

      // 2) Kiểm tra vé đã tồn tại chưa
      let tickets = await this.ticketRepository
        .createQueryBuilder('ticket')
        .leftJoinAndSelect('ticket.office', 'office')
        .where('ticket.trip_id = :tripId', { tripId: trip.id })
        .select([
          'ticket.id',
          'ticket.seat_name',
          'ticket.seat_status',
          'ticket.seat_floor',
          'ticket.seat_row',
          'ticket.seat_column',
          'ticket.seat_type',
          'ticket.seat_code',
          'ticket.booked_status',
          'ticket.ticket_phone',
          'ticket.ticket_email',
          'ticket.ticket_customer_name',
          'ticket.ticket_point_up',
          'ticket.ticket_point_down',
          'ticket.ticket_note',
          'ticket.ticket_display_price',
          'ticket.payment_method',
          'ticket.user_created',
          'ticket.user_id_created',
          'ticket.contact_status',
          'ticket.transit_up',
          'ticket.transit_down',
          'office.id',
          'office.name',
        ])
        .getMany();

      console.log(`Existing tickets count=${tickets.length}`);

      if (trip.trip_type === 1 || trip.trip_type === 3) {
        if (tickets.length > 0) {
          console.log(`DONE in ${Date.now() - start}ms`);
          return TicketMapper.mapToTicketDTO(tickets);
        }

        // 3) Kiểm tra schedule và seat_chart
        if (!trip.schedule) {
          throw new NotFoundException('Không tìm thấy lịch cho chuyến này');
        }
        if (!trip.schedule.seat_chart) {
          throw new NotFoundException(
            'Không tìm thấy sơ đồ ghế cho chuyến này',
          );
        }

        // 4) Lấy seats theo seat_chart.id
        const seats = await this.seatRepository.find({
          where: { seat_chart: { id: trip.schedule.seat_chart.id } },
          select: [
            'id',
            'code',
            'name',
            'status',
            'floor',
            'row',
            'column',
            'type',
          ],
        });
        console.log('seats:', seats.length);

        if (seats.length === 0) {
          console.warn('Seat chart has no seats');
          throw new NotFoundException('Sơ đồ ghế không có ghế nào');
        }

        // 5) Chuẩn bị dữ liệu insert nhanh
        const newTickets = seats.map((seat) => ({
          seat_name: seat.name,
          seat_status: seat.status,
          seat_floor: seat.floor,
          seat_row: seat.row,
          seat_column: seat.column,
          seat_type: seat.type,
          seat_code: seat.code,
          booked_status: false,
          ticket_display_price: trip.schedule.route?.base_price ?? 0,
          company_id: trip.company_id,
          trip: { id: trip.id } as any,
        }));

        // 6) Bulk insert để nhanh hơn save()
        await this.ticketRepository.insert(newTickets);

        // 7) Query lại tickets để trả về DTO
        tickets = await this.ticketRepository.find({
          where: { trip: { id: trip.id } },
        });

        console.log(`Inserted ${tickets.length} tickets`);
        console.log(`DONE in ${Date.now() - start}ms`);
        return TicketMapper.mapToTicketDTO(tickets);
      }

      console.log(`DONE in ${Date.now() - start}ms`);
      return null;
    } catch (err) {
      console.error(`ERROR: ${err?.message}`, err?.stack);
      throw err;
    }
  }

  async updateTicket(
    user: DTO_RQ_UserChooserTicket,
    data_update: DTO_RQ_TicketPayloadUpdate,
  ): Promise<DTO_RP_Ticket[]> {
    if (!data_update.id || data_update.id.length === 0) {
      throw new BadRequestException('Dữ liệu vé không hợp lệ');
    }

    return await this.ticketRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const tickets = await transactionalEntityManager.findByIds(
          this.ticketRepository.target,
          data_update.id,
        );

        if (tickets.length === 0) {
          throw new NotFoundException('Dữ liệu vé không tồn tại');
        }

        if (tickets.length !== data_update.id.length) {
          throw new NotFoundException('Dữ liệu vé không đầy đủ');
        }
        let existingOffice = null;
        if (data_update.office_id) {
          existingOffice = await transactionalEntityManager.findOne(
            this.officeRepository.target,
            { where: { id: data_update.office_id } },
          );

          if (!existingOffice) {
            throw new NotFoundException('Văn phòng không tồn tại');
          }
        }
        const updatedTickets = tickets.map((ticket) => {
          ticket.ticket_phone = data_update.ticket_phone;
          ticket.ticket_email = data_update.ticket_email;
          ticket.ticket_customer_name = data_update.ticket_customer_name;
          ticket.ticket_point_up = data_update.ticket_point_up;
          ticket.ticket_point_down = data_update.ticket_point_down;
          ticket.ticket_note = data_update.ticket_note;
          ticket.ticket_display_price = data_update.ticket_display_price;
          ticket.payment_method = data_update.payment_method;
          ticket.transit_up = data_update.transit_up;
          ticket.transit_down = data_update.transit_down;

          if (!ticket.user_created || !ticket.user_id_created) {
            ticket.user_created = user.full_name;
            ticket.user_id_created = user.id;
          }
          if (!ticket.office && existingOffice) {
            ticket.office = existingOffice;
          }
          if (ticket.booked_status === false) {
            ticket.booked_status = true;
          }

          return ticket;
        });

        const savedTickets =
          await transactionalEntityManager.save(updatedTickets);

        return TicketMapper.mapToTicketDTO(savedTickets);
      },
    );
  }

  async cancelTicket(
    user: DTO_RQ_UserAction,
    data_cancel: DTO_RQ_CancelTicket,
  ): Promise<DTO_RP_Ticket[]> {
    console.log(user, data_cancel);
    const tickets = await this.ticketRepository.find({
      where: { id: In(data_cancel.id) },
      relations: ['trip', 'trip.route'],
    });
    if (tickets.length === 0) {
      throw new NotFoundException('Dữ liệu vé không tồn tại');
    }
    if (tickets.length !== data_cancel.id.length) {
      throw new NotFoundException('Dữ liệu vé không đầy đủ');
    }

    const cancelPromises = tickets.map(async (ticket) => {
      if (ticket.booked_status === true) {
        ticket.booked_status = false;
        ticket.ticket_phone = null;
        ticket.ticket_email = null;
        ticket.ticket_customer_name = null;
        ticket.ticket_point_up = null;
        ticket.ticket_point_down = null;
        ticket.ticket_note = null;
        ticket.ticket_display_price = ticket.trip.route.base_price;
        ticket.payment_method = null;
        ticket.user_created = null;
        ticket.user_id_created = null;
        ticket.office = null;
        ticket.contact_status = 1;
      }
      return await this.ticketRepository.save(ticket);
    });

    const canceledTickets = await Promise.all(cancelPromises);
    console.log('Canceled tickets:', canceledTickets);

    return TicketMapper.mapToTicketDTO(canceledTickets);
  }

  async copyTickets(
    user: DTO_RQ_UserChooserTicket,
    data_copy: DTO_RQ_CopyTicket[],
    data_pastes: number[],
  ): Promise<DTO_RP_Ticket[]> {
    console.log(user, data_copy, data_pastes);

    if (!data_copy || data_copy.length === 0) {
      throw new NotFoundException('Không có dữ liệu vé để sao chép');
    }
    if (!data_pastes || data_pastes.length === 0) {
      throw new NotFoundException('Không có vé đích để dán');
    }

    const targetTickets = await this.ticketRepository.find({
      where: { id: In(data_pastes) },
    });

    if (targetTickets.length === 0) {
      throw new NotFoundException('Không tìm thấy vé để dán');
    }
    if (targetTickets.length !== data_pastes.length) {
      throw new NotFoundException('Một số vé đích không tồn tại');
    }
    const templateData = data_copy[0];

    let existingOffice = null;
    if (user.office_id) {
      existingOffice = await this.officeRepository.findOne({
        where: { id: user.office_id },
      });

      if (!existingOffice) {
        throw new NotFoundException('Văn phòng không tồn tại');
      }
    }

    const updatePromises = targetTickets.map(async (ticket) => {
      ticket.booked_status = true;
      ticket.ticket_phone = templateData.ticket_phone;
      ticket.ticket_email = templateData.ticket_email;
      ticket.ticket_customer_name = templateData.ticket_customer_name;
      ticket.ticket_point_up = templateData.ticket_point_up;
      ticket.ticket_point_down = templateData.ticket_point_down;
      ticket.ticket_note = templateData.ticket_note;
      ticket.ticket_display_price = templateData.ticket_display_price;
      ticket.payment_method = templateData.payment_method;
      ticket.user_created = user.full_name;
      ticket.user_id_created = user.id;
      ticket.office = existingOffice;
      ticket.contact_status = 1;

      return await this.ticketRepository.save(ticket);
    });

    const updatedTickets = await Promise.all(updatePromises);

    return TicketMapper.mapToTicketDTO(updatedTickets);
  }

  async moveTickets(
    user: DTO_RQ_UserAction,
    sourceTickets: DTO_RQ_MoveTicket[],
    destinationTicketIds: number[],
  ): Promise<DTO_RP_Ticket[]> {
    console.log('=== BẮT ĐẦU moveTickets ===');
    console.log('1. Input parameters:');
    console.log('   - User:', user);
    console.log('   - Source tickets:', sourceTickets);
    console.log('   - Destination ticket IDs:', destinationTicketIds);

    if (!sourceTickets || sourceTickets.length === 0) {
      console.log('2. ERROR: Không có vé nguồn để di chuyển');
      throw new BadRequestException('Không có vé nguồn để di chuyển');
    }

    if (!destinationTicketIds || destinationTicketIds.length === 0) {
      console.log('2. ERROR: Không có vé đích để di chuyển');
      throw new BadRequestException('Không có vé đích để di chuyển');
    }

    if (sourceTickets.length !== destinationTicketIds.length) {
      console.log('2. ERROR: Số lượng vé nguồn và vé đích không khớp');
      console.log(`   - Source tickets count: ${sourceTickets.length}`);
      console.log(
        `   - Destination tickets count: ${destinationTicketIds.length}`,
      );
      throw new BadRequestException('Số lượng vé nguồn và vé đích không khớp');
    }

    console.log('2. Validation passed - starting transaction');

    return await this.ticketRepository.manager.transaction(
      async (transactionalEntityManager) => {
        console.log('3. Inside transaction');

        // Lấy thông tin vé nguồn
        const sourceTicketIds = sourceTickets.map((ticket) => ticket.id);
        console.log('4. Source ticket IDs extracted:', sourceTicketIds);

        const sourceTicketEntities = await transactionalEntityManager.find(
          this.ticketRepository.target,
          {
            where: { id: In(sourceTicketIds) },
            relations: ['trip', 'trip.route'],
          },
        );
        console.log(
          '5. Source ticket entities found:',
          sourceTicketEntities.length,
        );
        console.log(
          '   - Source entities:',
          sourceTicketEntities.map((t) => ({
            id: t.id,
            booked_status: t.booked_status,
          })),
        );

        if (sourceTicketEntities.length !== sourceTickets.length) {
          console.log('5. ERROR: Một số vé nguồn không tồn tại');
          console.log(
            `   - Expected: ${sourceTickets.length}, Found: ${sourceTicketEntities.length}`,
          );
          throw new NotFoundException('Một số vé nguồn không tồn tại');
        }

        // Lấy thông tin vé đích
        console.log('6. Getting destination ticket entities...');
        const destinationTicketEntities = await transactionalEntityManager.find(
          this.ticketRepository.target,
          {
            where: { id: In(destinationTicketIds) },
          },
        );
        console.log(
          '7. Destination ticket entities found:',
          destinationTicketEntities.length,
        );
        console.log(
          '   - Destination entities:',
          destinationTicketEntities.map((t) => ({
            id: t.id,
            booked_status: t.booked_status,
          })),
        );

        if (destinationTicketEntities.length !== destinationTicketIds.length) {
          console.log('7. ERROR: Một số vé đích không tồn tại');
          console.log(
            `   - Expected: ${destinationTicketIds.length}, Found: ${destinationTicketEntities.length}`,
          );
          throw new NotFoundException('Một số vé đích không tồn tại');
        }

        // Kiểm tra vé đích chưa được đặt
        console.log('8. Checking if destination tickets are available...');
        const bookedDestinationTickets = destinationTicketEntities.filter(
          (ticket) => ticket.booked_status === true,
        );
        console.log(
          '   - Already booked destination tickets:',
          bookedDestinationTickets.length,
        );

        if (bookedDestinationTickets.length > 0) {
          console.log('8. ERROR: Một số vé đích đã được đặt');
          console.log(
            '   - Booked tickets:',
            bookedDestinationTickets.map((t) => ({ id: t.id })),
          );
          throw new BadRequestException('Một số vé đích đã được đặt');
        }

        // Lấy thông tin office
        console.log('9. Getting office information...');
        let existingOffice = null;
        if (sourceTickets[0].office_id) {
          console.log(
            `   - Looking for office ID: ${sourceTickets[0].office_id}`,
          );
          existingOffice = await transactionalEntityManager.findOne(
            this.officeRepository.target,
            { where: { id: sourceTickets[0].office_id } },
          );
          console.log(
            '   - Office found:',
            existingOffice ? existingOffice.id : 'null',
          );
        } else {
          console.log('   - No office_id in source ticket');
        }

        // Di chuyển dữ liệu từ vé nguồn sang vé đích
        console.log('10. Moving data from source to destination tickets...');
        const updatedDestinationTickets = destinationTicketEntities.map(
          (destTicket, index) => {
            const sourceTicket = sourceTickets[index];
            console.log(
              `   - Processing pair ${index + 1}: Source ID ${sourceTicket.id} -> Destination ID ${destTicket.id}`,
            );

            destTicket.booked_status = sourceTicket.booked_status;
            destTicket.ticket_phone = sourceTicket.ticket_phone;
            destTicket.ticket_email = sourceTicket.ticket_email;
            destTicket.ticket_customer_name = sourceTicket.ticket_customer_name;
            destTicket.ticket_point_up = sourceTicket.ticket_point_up;
            destTicket.ticket_point_down = sourceTicket.ticket_point_down;
            destTicket.ticket_note = sourceTicket.ticket_note;
            destTicket.ticket_display_price = sourceTicket.ticket_display_price;
            destTicket.payment_method = sourceTicket.payment_method;
            destTicket.user_created = sourceTicket.user_created;
            destTicket.user_id_created = sourceTicket.user_id_created;
            destTicket.office = existingOffice;
            destTicket.contact_status = 1;

            return destTicket;
          },
        );
        console.log(
          '   - Updated destination tickets count:',
          updatedDestinationTickets.length,
        );

        // Hủy vé nguồn
        console.log('11. Canceling source tickets...');
        const canceledSourceTickets = sourceTicketEntities.map(
          (sourceTicketEntity) => {
            console.log(
              `   - Canceling source ticket ID: ${sourceTicketEntity.id}`,
            );

            sourceTicketEntity.booked_status = false;
            sourceTicketEntity.ticket_phone = null;
            sourceTicketEntity.ticket_email = null;
            sourceTicketEntity.ticket_customer_name = null;
            sourceTicketEntity.ticket_point_up = null;
            sourceTicketEntity.ticket_point_down = null;
            sourceTicketEntity.ticket_note = null;
            sourceTicketEntity.ticket_display_price =
              sourceTicketEntity.trip.route.base_price;
            sourceTicketEntity.payment_method = null;
            sourceTicketEntity.user_created = null;
            sourceTicketEntity.user_id_created = null;
            sourceTicketEntity.office = null;
            sourceTicketEntity.contact_status = 1;

            return sourceTicketEntity;
          },
        );
        console.log(
          '   - Canceled source tickets count:',
          canceledSourceTickets.length,
        );

        // Lưu tất cả thay đổi
        console.log('12. Saving all changes to database...');
        const allTicketsToSave = [
          ...updatedDestinationTickets,
          ...canceledSourceTickets,
        ];
        console.log(`   - Total tickets to save: ${allTicketsToSave.length}`);

        await transactionalEntityManager.save(allTicketsToSave);
        console.log('   - Database save completed successfully');

        console.log('13. Mapping to DTO...');
        const result = TicketMapper.mapToTicketDTO(updatedDestinationTickets);
        console.log('   - Mapped result count:', result.length);

        console.log('=== KẾT THÚC moveTickets THÀNH CÔNG ===');
        return result;
      },
    );
  }

  async updateContactStatus(
    user: DTO_RQ_UserAction,
    ticketIds: number[],
    status: number,
  ): Promise<DTO_RP_Ticket[]> {
    console.log(user, ticketIds, status);

    if (!ticketIds || ticketIds.length === 0) {
      throw new BadRequestException('Danh sách ID vé không hợp lệ');
    }

    if (status === null || status === undefined) {
      throw new BadRequestException('Trạng thái liên hệ không hợp lệ');
    }

    const tickets = await this.ticketRepository.find({
      where: { id: In(ticketIds) },
    });

    if (tickets.length === 0) {
      throw new NotFoundException('Không tìm thấy vé nào');
    }

    if (tickets.length !== ticketIds.length) {
      throw new NotFoundException('Một số vé không tồn tại');
    }

    const updatePromises = tickets.map(async (ticket) => {
      ticket.contact_status = status;
      return await this.ticketRepository.save(ticket);
    });

    const updatedTickets = await Promise.all(updatePromises);

    return TicketMapper.mapToTicketDTO(updatedTickets);
  }

  async getListCustomerByTrip(
    id: number,
  ): Promise<DTO_RP_ListCustomerByTrip[]> {
    const existingTrip = await this.tripRepository.findOne({
      where: { id },
    });
    if (!existingTrip) {
      throw new NotFoundException('Chuyến không tồn tại');
    }

    const bookedTickets = await this.ticketRepository.find({
      where: { trip: { id }, booked_status: true },
      order: { created_at: 'ASC' },
    });

    if (bookedTickets.length === 0) {
      return [];
    }

    return TicketMapper.mapToCustomerListDTO(bookedTickets);
  }

  async getListTransitUpByTrip(
    id: number,
  ): Promise<DTO_RP_ListTransitUpByTrip[]> {
    const existingTrip = await this.tripRepository.findOne({
      where: { id },
    });
    if (!existingTrip) {
      throw new NotFoundException('Chuyến không tồn tại');
    }

    const transitUpTickets = await this.ticketRepository.find({
      where: { trip: { id }, booked_status: true, transit_up: true },
      order: { created_at: 'ASC' },
    });

    if (transitUpTickets.length === 0) {
      return [];
    }

    return TicketMapper.mapToTransitUpListDTO(transitUpTickets);
  }

  async getListTransitDownByTrip(
    id: number,
  ): Promise<DTO_RP_ListTransitDownByTrip[]> {
    const existingTrip = await this.tripRepository.findOne({
      where: { id },
    });
    if (!existingTrip) {
      throw new NotFoundException('Chuyến không tồn tại');
    }

    const transitDownTickets = await this.ticketRepository.find({
      where: { trip: { id }, booked_status: true, transit_down: true },
      order: { created_at: 'ASC' },
    });

    if (transitDownTickets.length === 0) {
      return [];
    }

    return TicketMapper.mapToTransitDownListDTO(transitDownTickets);
  }

  async searchTickets(
    query: string,
    company_id: string,
  ): Promise<DTO_RP_SearchTicket[]> {
    console.log(query, company_id);

    if (!query || query.trim() === '') {
      throw new BadRequestException('Từ khóa tìm kiếm không được để trống');
    }

    const tickets = await this.ticketRepository
      .createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.trip', 'trip')
      .leftJoinAndSelect('trip.route', 'route')
      .where('ticket.company_id = :company_id', { company_id })
      .andWhere('ticket.booked_status = :booked_status', {
        booked_status: true,
      })
      .andWhere(
        '(ticket.ticket_phone LIKE :query OR ticket.ticket_customer_name LIKE :query)',
        { query: `%${query}%` },
      )
      .orderBy('trip.departure_date', 'DESC')
      .addOrderBy('trip.departure_time', 'DESC')
      .limit(50)
      .getMany();

    return tickets.map((ticket) => ({
      ticket_id: ticket.id,
      trip_id: ticket.trip.id,
      route_id: ticket.trip.route?.id || 0,
      route_name: ticket.trip.route?.route_name || '',
      departure_date: ticket.trip.departure_date,
      departure_time: ticket.trip.departure_time,
      seat_name: ticket.seat_name,
      ticket_phone: ticket.ticket_phone,
      ticket_customer_name: ticket.ticket_customer_name,
      ticket_display_price: ticket.ticket_display_price,
    }));
  }

  async getTicketsByTripToPrint(id: number): Promise<DTO_RP_TicketsToPrint[]> {
    try {
      const tickets = await this.ticketRepository
        .createQueryBuilder('ticket')
        .where('ticket.trip_id = :id', { id })
        .select([
          'ticket.id',
          'ticket.seat_name',
          'ticket.seat_status',
          'ticket.seat_floor',
          'ticket.seat_row',
          'ticket.seat_column',
          'ticket.seat_type',
          'ticket.seat_code',
          'ticket.booked_status',
          'ticket.ticket_phone',
          'ticket.ticket_email',
          'ticket.ticket_customer_name',
          'ticket.ticket_point_up',
          'ticket.ticket_point_down',
          'ticket.ticket_note',
          'ticket.ticket_display_price',
          'ticket.payment_method',
        ])
        .getMany();

      if (!tickets || tickets.length === 0) {
        return [];
      }

      return TicketMapper.mapTicketsToPrintDTO(tickets);
    } catch (error) {
      console.error('❌ Lỗi khi lấy danh sách vé để in:', error);
      throw new InternalServerErrorException('Có lỗi khi lấy danh sách vé');
    }
  }
}
