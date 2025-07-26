import { Controller, HttpStatus } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import {
  DTO_RQ_CancelTicket,
  DTO_RQ_CopyTicket,
  DTO_RQ_TicketPayloadUpdate,
  DTO_RQ_UserChooserTicket,
} from './ticket.dto';

@Controller()
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @MessagePattern({ bms: 'get_list_tickets_by_trip' })
  async getListTicketsByTrip(@Payload() data: { id: number }) {
    try {
      const result = await this.ticketService.getListTicketsByTrip(data.id);
      return {
        success: true,
        statusCode: HttpStatus.OK,
        message: 'Lấy danh sách vé thành công',
        result,
      };
    } catch (error) {
      throw new RpcException({
        success: false,
        message: error.response?.message || 'Lỗi máy chủ dịch vụ!',
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @MessagePattern({ bms: 'update_ticket' })
  async updateTicket(
    @Payload()
    payload: {
      user: DTO_RQ_UserChooserTicket;
      data_update: DTO_RQ_TicketPayloadUpdate;
    },
  ) {
    try {
      const result = await this.ticketService.updateTicket(
        payload.user,
        payload.data_update,
      );
      return {
        success: true,
        statusCode: HttpStatus.OK,
        message: 'Cập nhật vé thành công',
        result,
      };
    } catch (error) {
      throw new RpcException({
        success: false,
        message: error.response?.message || 'Lỗi máy chủ dịch vụ!',
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @MessagePattern({ bms: 'cancel_ticket' })
  async cancelTicket(@Payload() payload: { data: DTO_RQ_CancelTicket }) {
    try {
      const result = await this.ticketService.cancelTicket(payload.data);
      return {
        success: true,
        statusCode: HttpStatus.OK,
        message: 'Hủy vé thành công',
        result,
      };
    } catch (error) {
      throw new RpcException({
        success: false,
        message: error.response?.message || 'Lỗi máy chủ dịch vụ!',
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @MessagePattern({ bms: 'copy_tickets' })
  async copyTickets(
    @Payload()
    payload: {
      user: DTO_RQ_UserChooserTicket;
      data_copy: DTO_RQ_CopyTicket[];
      data_pastes: number[];
    },
  ) {
    try {
      const result = await this.ticketService.copyTickets(
        payload.user,
        payload.data_copy,
        payload.data_pastes,
      );
      return {
        success: true,
        statusCode: HttpStatus.OK,
        message: 'Success',
        result,
      };
    } catch (error) {
      throw new RpcException({
        success: false,
        message: error.response?.message || 'Server error!',
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
