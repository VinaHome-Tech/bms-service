import { ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Seat } from "src/entities/seat.entity";
import { SeatChart } from "src/entities/seat_chart.entity";
import { DataSource, In, Not, Repository } from "typeorm";
import { DTO_RQ_SeatChart } from "./bms_seat.dto";

@Injectable()
export class BmsSeatService {
  constructor(
    @InjectRepository(SeatChart)
    private readonly seatChartRepo: Repository<SeatChart>,
    @InjectRepository(Seat)
    private readonly seatRepo: Repository<Seat>,
    private readonly dataSource: DataSource,
  ) { }

  // M4_v2.F1
  async GetListSeatChartByCompanyId(companyId: string) {
    try {
      const seatCharts = await this.seatChartRepo.find({
        where: { company_id: companyId },
        relations: ['seats'],
        order: { created_at: 'ASC' },
      });

      const formatted = seatCharts.map((chart) => ({
        id: chart.id,
        seat_chart_name: chart.seat_chart_name,
        seat_chart_type: chart.seat_chart_type,
        total_floor: chart.total_floor,
        total_row: chart.total_row,
        total_column: chart.total_column,
        total_seat: chart.total_seat,
        seats: chart.seats.map((s) => ({
          id: s.id,
          code: s.code,
          name: s.name,
          status: s.status,
          floor: s.floor,
          row: s.row,
          column: s.column,
        })),
      }));

      return {
        success: true,
        message: 'Success',
        statusCode: HttpStatus.OK,
        result: formatted,
      };

    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException(
        'Lỗi hệ thống. Vui lòng thử lại sau',
      );
    }
  }


  // M4_v2.F2
  async CreateSeatChart(companyId: string, data: DTO_RQ_SeatChart) {
    // --- Transaction ---
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // === 1. Normalize ===
      const name = data.seat_chart_name.trim() || null;
      const seatType = data.seat_chart_type;
      const totalFloor = data.total_floor;
      const totalRow = data.total_row;
      const totalColumn = data.total_column;

      // === 2. Check duplicate seat_chart_name ===
      const existChart = await queryRunner.manager.findOne(SeatChart, {
        where: { company_id: companyId, seat_chart_name: name }
      });

      if (existChart) {
        throw new ConflictException('Tên sơ đồ ghế đã tồn tại.');
      }

      // === 3. Validate duplicate seats ===
      const seatKeys = new Set();

      for (const seat of data.seats) {
        const key = `${seat.floor}-${seat.row}-${seat.column}`;
        if (seatKeys.has(key)) {
          throw new ConflictException(
            `Ghế bị trùng vị trí (floor ${seat.floor}, row ${seat.row}, column ${seat.column})`
          );
        }
        seatKeys.add(key);
      }

      // === 4. Validate code duplicate ===
      const seatCodes = new Set();
      for (const seat of data.seats) {
        const code = seat.code.trim().toUpperCase();
        if (seatCodes.has(code)) {
          throw new ConflictException(`Mã ghế '${code}' bị trùng.`);
        }
        seatCodes.add(code);
      }

      // === 5. Create SeatChart ===
      const newSeatChart = queryRunner.manager.create(SeatChart, {
        seat_chart_name: name,
        seat_chart_type: seatType,
        total_floor: totalFloor,
        total_row: totalRow,
        total_column: totalColumn,
        total_seat: data.seats.filter(s => s.status === true).length,
        company_id: companyId,
      });

      const savedChart = await queryRunner.manager.save(newSeatChart);

      // === 6. Create seats ===
      const seats = data.seats.map(s =>
        queryRunner.manager.create(Seat, {
          code: s.code.trim().toUpperCase(),
          name: s.name ? s.name.trim() : null,
          status: s.status,
          floor: s.floor,
          row: s.row,
          column: s.column,
          seat_chart_id: savedChart.id,
        })
      );

      const savedSeats = await queryRunner.manager.save(Seat, seats);

      await queryRunner.commitTransaction();

      // === 7. Response ===
      return {
        success: true,
        message: 'Success',
        statusCode: HttpStatus.CREATED,
        result: {
          id: savedChart.id,
          seat_chart_name: savedChart.seat_chart_name,
          seat_chart_type: savedChart.seat_chart_type,
          total_floor: savedChart.total_floor,
          total_row: savedChart.total_row,
          total_column: savedChart.total_column,
          total_seat: savedChart.total_seat,
          seats: savedSeats.map(s => ({
            id: s.id,
            code: s.code,
            name: s.name,
            status: s.status,
            floor: s.floor,
            row: s.row,
            column: s.column,
          })),
        }
      };

    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof HttpException) throw error;

      console.error(error);
      throw new InternalServerErrorException('Lỗi hệ thống. Vui lòng thử lại sau');
    } finally {
      await queryRunner.release();
    }
  }


  // M4_v2.F3
  async UpdateSeatChart(seatChartId: string, data: DTO_RQ_SeatChart) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      // === 1. Load seat chart + seats ===
      const seatChart = await queryRunner.manager.findOne(SeatChart, {
        where: { id: seatChartId },
        relations: ['seats'],
      });

      if (!seatChart) {
        throw new NotFoundException('Sơ đồ ghế không tồn tại');
      }

      // === 2. Normalize dữ liệu ===
      const name = data.seat_chart_name.trim();
      const seatsInput = data.seats.map((s) => ({
        id: s.id,
        name: (typeof s.name === 'string' && s.name.trim() !== '')
          ? s.name.trim()
          : null,
        code: s.code.trim().toUpperCase(),
        status: s.status,
        floor: s.floor,
        row: s.row,
        column: s.column,
      }));


      // === 3. Validate duplicate code ===
      const codeSet = new Set();
      for (const s of seatsInput) {
        if (codeSet.has(s.code)) {
          throw new ConflictException(`Mã ghế '${s.code}' bị trùng.`);
        }
        codeSet.add(s.code);
      }

      // === 4. Validate position duplicate ===
      const posSet = new Set();
      for (const s of seatsInput) {
        const key = `${s.floor}-${s.row}-${s.column}`;
        if (posSet.has(key)) {
          throw new ConflictException(
            `Ghế bị trùng vị trí (floor ${s.floor}, row ${s.row}, column ${s.column})`
          );
        }
        posSet.add(key);
      }

      // === 5. Cập nhật seat chart ===
      seatChart.seat_chart_name = name;
      seatChart.seat_chart_type = data.seat_chart_type;
      seatChart.total_floor = data.total_floor;
      seatChart.total_row = data.total_row;
      seatChart.total_column = data.total_column;
      seatChart.total_seat = seatsInput.filter((s) => s.status).length;

      await queryRunner.manager.save(seatChart);

      // === 6. Map hiện tại ===
      const existingSeats = seatChart.seats;
      const existingMap = new Map(existingSeats.map((s) => [s.code, s]));

      const seatsToCreate: Seat[] = [];
      const seatsToUpdate: Seat[] = [];

      // === 7. Create or Update seats ===
      for (const s of seatsInput) {
        const oldSeat = existingMap.get(s.code);

        if (oldSeat) {
          // update
          oldSeat.name = s.name ?? null;
          oldSeat.status = s.status;
          oldSeat.floor = s.floor;
          oldSeat.row = s.row;
          oldSeat.column = s.column;
          seatsToUpdate.push(oldSeat);
        } else {
          // create
          seatsToCreate.push(
            queryRunner.manager.create(Seat, {
              name: s.name ?? null,
              code: s.code,
              status: s.status,
              floor: s.floor,
              row: s.row,
              column: s.column,
              seat_chart: seatChart,
            })
          );
        }
      }

      if (seatsToUpdate.length > 0) {
        await queryRunner.manager.save(Seat, seatsToUpdate);
      }

      if (seatsToCreate.length > 0) {
        await queryRunner.manager.save(Seat, seatsToCreate);
      }

      // === 8. Delete old seats not in new input ===
      const newCodes = seatsInput.map((s) => s.code);

      await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from(Seat)
        .where('seat_chart_id = :id', { id: seatChartId })
        .andWhere('code NOT IN (:...codes)', { codes: newCodes })
        .execute();

      // === 9. Load final result ===
      const finalSeatChart = await queryRunner.manager.findOne(SeatChart, {
        where: { id: seatChartId },
        relations: ['seats'],
      });

      await queryRunner.commitTransaction();

      return {
        success: true,
        message: 'Success',
        statusCode: HttpStatus.OK,
        result: finalSeatChart,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof HttpException) throw error;
      console.error("Error:", error);
      throw new InternalServerErrorException('Lỗi hệ thống. Vui lòng thử lại sau');
    } finally {
      await queryRunner.release();
    }
  }



  // M4_v2.F4
  async DeleteSeatChart(seatChartId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const seatChart = await queryRunner.manager.findOne(SeatChart, {
        where: { id: seatChartId },
      });

      if (!seatChart) {
        throw new NotFoundException('Sơ đồ ghế không tồn tại');
      }

      // Xóa seats
      await queryRunner.manager.delete(Seat, {
        seat_chart_id: seatChartId,
      });

      // Xóa seat chart
      await queryRunner.manager.delete(SeatChart, seatChartId);

      await queryRunner.commitTransaction();

      return {
        success: true,
        message: 'Success',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException('Lỗi hệ thống. Vui lòng thử lại sau');
    } finally {
      await queryRunner.release();
    }
  }


  // M4_v2.F5
  async GetListSeatChartNameByCompanyId(companyId: string) {
    try {
      const seatCharts = await this.seatChartRepo.find({
        where: {
          company_id: companyId,
        },
        select: {
          id: true,
          seat_chart_name: true,
        },
        order: { id: 'ASC' },
      });
      return {
        success: true,
        message: 'Success',
        statusCode: HttpStatus.OK,
        result: seatCharts,
      }
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Lỗi hệ thống. Vui lòng thử lại sau.');
    } 
  }

}