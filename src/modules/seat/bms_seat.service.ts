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
      const name = data.seat_chart_name.trim();
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
          name: s.name.trim(),
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
    try {
      console.time('UpdateSeatChart');

      // ✅ Load luôn seats
      const seatChart = await this.seatChartRepo.findOne({
        where: { id: seatChartId },
        relations: ['seats'],
      });

      if (!seatChart) {
        throw new NotFoundException('Sơ đồ ghế không tồn tại');
      }

      seatChart.seat_chart_name = data.seat_chart_name;
      seatChart.seat_chart_type = data.seat_chart_type;
      seatChart.total_floor = data.total_floor;
      seatChart.total_row = data.total_row;
      seatChart.total_column = data.total_column;
      seatChart.total_seat = data.seats.filter((s) => s.status === true).length;

      const updatedSeatChart = await this.seatChartRepo.save(seatChart);

      const existingSeats = seatChart.seats || [];
      const newSeatsData = data.seats || [];

      const existingSeatMap = new Map<string, any>(
        existingSeats.map((s) => [s.code, s]),
      );

      const newSeatCodeSet = new Set(newSeatsData.map((s) => s.code));

      const seatsToCreate = [];
      const seatsToUpdate = [];

      for (const seatData of newSeatsData) {
        const existingSeat = existingSeatMap.get(seatData.code);
        if (existingSeat) {
          Object.assign(existingSeat, {
            name: seatData.name,
            status: seatData.status,
            floor: seatData.floor,
            row: seatData.row,
            column: seatData.column,
          });
          seatsToUpdate.push(existingSeat);
        } else {
          seatsToCreate.push(
            this.seatRepo.create({
              name: seatData.name,
              code: seatData.code,
              status: seatData.status,
              floor: seatData.floor,
              row: seatData.row,
              column: seatData.column,
              seat_chart: updatedSeatChart,
            }),
          );
        }
      }

      if (seatsToUpdate.length) await this.seatRepo.save(seatsToUpdate);
      if (seatsToCreate.length) await this.seatRepo.save(seatsToCreate);

      // Xoá ghế không còn trong danh sách
      const codesToKeep = Array.from(newSeatCodeSet);
      await this.seatRepo.delete({
        seat_chart: { id: seatChartId },
        code: Not(In(codesToKeep)),
      });

      const finalSeatChart = await this.seatChartRepo.findOne({
        where: { id: updatedSeatChart.id },
        select: {
          id: true,
          seat_chart_name: true,
          seat_chart_type: true,
          total_floor: true,
          total_row: true,
          total_column: true,
          total_seat: true,
          seats: true,
        },
        relations: ['seats'],
      });

      return {
        success: true,
        message: 'Success',
        statusCode: HttpStatus.OK,
        result: finalSeatChart,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new InternalServerErrorException('Lỗi hệ thống. Vui lòng thử lại sau');
    }
  }


  // M4_v2.F4
  async DeleteSeatChart(seatChartId: string) {
    try {
      console.time('DeleteSeatChart');
      const seatChart = await this.seatChartRepo.findOne({ where: { id: seatChartId } });
      if (!seatChart) {
        throw new NotFoundException('Sơ đồ ghế không tồn tại');
      }

      await this.seatRepo.delete({ seat_chart: { id: seatChartId } });
      await this.seatChartRepo.delete(seatChartId);

      return {
        success: true,
        message: 'Success',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new InternalServerErrorException('Xoá sơ đồ ghế thất bại');
    } finally {
      console.timeEnd('DeleteSeatChart');
    }
  }

  // M4_v2.F5
  async GetListSeatChartNameByCompanyId(companyId: string) {
    try {
      console.time('GetListSeatChartNameByCompanyId');
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
      console.error(error);
      throw new InternalServerErrorException('Lấy danh sách tên sơ đồ ghế thất bại');
    } finally {
      console.timeEnd('GetListSeatChartNameByCompanyId');
    }
  }

}