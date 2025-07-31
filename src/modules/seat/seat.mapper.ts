import { DTO_RP_SeatChart } from './seat.dto';
import { SeatChart } from './seat_chart.entity';

export class SeatMapper {
  static toDTO(seat: SeatChart): DTO_RP_SeatChart {
    return {
      id: seat.id,
      seat_chart_name: seat.seat_chart_name,
      seat_chart_type: seat.seat_chart_type,
      total_floor: seat.total_floor,
      total_row: seat.total_row,
      total_column: seat.total_column,
      seats: seat.seats.map((seat) => ({
        id: seat.id,
        code: seat.code,
        name: seat.name,
        status: seat.status,
        floor: seat.floor,
        row: seat.row,
        column: seat.column,
        type: seat.type,
      })),
    };
  }
}
