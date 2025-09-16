import { Controller, HttpStatus } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import {
  DTO_RQ_CancelTicket,
  DTO_RQ_CopyTicket,
  DTO_RQ_MoveTicket,
  DTO_RQ_TicketPayloadUpdate,
  DTO_RQ_UserChooserTicket,
} from './ticket.dto';
import { DTO_RQ_UserAction } from 'src/utils/user.dto';

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
        message: 'Success',
        result,
      };
    } catch (error) {
      throw new RpcException({
        success: false,
        message: error.response?.message || 'Service error!',
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
        message: 'Success',
        result,
      };
    } catch (error) {
      throw new RpcException({
        success: false,
        message: error.response?.message || 'Service error!',
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @MessagePattern({ bms: 'cancel_ticket' })
  async cancelTicket(
    @Payload()
    payload: {
      user: DTO_RQ_UserAction;
      data_cancel: DTO_RQ_CancelTicket;
    },
  ) {
    try {
      const result = await this.ticketService.cancelTicket(
        payload.user,
        payload.data_cancel,
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
        message: error.response?.message || 'Service error!',
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
        message: error.response?.message || 'Service error!',
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @MessagePattern({ bms: 'move_tickets' })
  async moveTickets(
    @Payload()
    payload: {
      user: DTO_RQ_UserAction;
      sourceTickets: DTO_RQ_MoveTicket[];
      destinationTicketIds: number[];
    },
  ) {
    try {
      const result = await this.ticketService.moveTickets(
        payload.user,
        payload.sourceTickets,
        payload.destinationTicketIds,
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
        message: error.response?.message || 'Service error!',
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @MessagePattern({ bms: 'update_contact_status' })
  async updateContactStatus(
    @Payload()
    payload: {
      user: DTO_RQ_UserAction;
      ticketIds: number[];
      status: number;
    },
  ) {
    try {
      const result = await this.ticketService.updateContactStatus(
        payload.user,
        payload.ticketIds,
        payload.status,
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
        message: error.response?.message || 'Service error!',
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @MessagePattern({ bms: 'get_list_customer_by_trip' })
  async getListCustomerByTrip(@Payload() data: { id: number }) {
    try {
      const result = await this.ticketService.getListCustomerByTrip(data.id);
      return {
        success: true,
        statusCode: HttpStatus.OK,
        message: 'Success',
        result,
      };
    } catch (error) {
      throw new RpcException({
        success: false,
        message: error.response?.message || 'Service error!',
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @MessagePattern({ bms: 'get_list_transit_up_by_trip' })
  async getListTransitUpByTrip(@Payload() data: { id: number }) {
    try {
      const result = await this.ticketService.getListTransitUpByTrip(data.id);
      return {
        success: true,
        statusCode: HttpStatus.OK,
        message: 'Success',
        result,
      };
    } catch (error) {
      throw new RpcException({
        success: false,
        message: error.response?.message || 'Service error!',
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @MessagePattern({ bms: 'get_list_transit_down_by_trip' })
  async getListTransitDownByTrip(@Payload() data: { id: number }) {
    try {
      const result = await this.ticketService.getListTransitDownByTrip(data.id);
      return {
        success: true,
        statusCode: HttpStatus.OK,
        message: 'Success',
        result,
      };
    } catch (error) {
      throw new RpcException({
        success: false,
        message: error.response?.message || 'Service error!',
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @MessagePattern({ bms: 'search_tickets' })
  async searchTickets(
    @Payload() payload: { query: string; company_id: string },
  ) {
    try {
      const result = await this.ticketService.searchTickets(
        payload.query,
        payload.company_id,
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
        message: error.response?.message || 'Service error!',
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @MessagePattern({ bms: 'get_tickets_by_trip_to_print' })
  async getTicketsByTripToPrint(@Payload() id: number) {
    try {
      const result = await this.ticketService.getTicketsByTripToPrint(id);
      return {
        success: true,
        statusCode: HttpStatus.OK,
        message: 'Success',
        result,
      };
    } catch (error) {
      throw new RpcException({
        success: false,
        message: error.response?.message || 'Service error!',
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
