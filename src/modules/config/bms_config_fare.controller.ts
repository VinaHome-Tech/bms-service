// import { Controller, HttpStatus } from '@nestjs/common';
// import { BmsConfigFareService } from './bms_config_fare.service';
// import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
// import { DTO_RQ_ConfigFare } from './bms_config_fare.dto';

// @Controller()
// export class BmsConfigFareController {
//   constructor(private readonly bmsConfigFareService: BmsConfigFareService) {}

//   @MessagePattern({ bms: 'CREATE_CONFIG_FARE' })
//   async createConfigFare(@Payload() data: DTO_RQ_ConfigFare) {
//     try {
//       const result = await this.bmsConfigFareService.createConfigFare(data);
//       return {
//         success: true,
//         statusCode: HttpStatus.OK,
//         message: 'Success',
//         result,
//       };
//     } catch (error) {
//       throw new RpcException({
//         success: false,
//         message: error.response?.message || 'Service error',
//         statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
//       });
//     }
//   }

//   @MessagePattern({ bms: 'GET_LIST_CONFIG_FARE_BY_COMPANY' })
//   async getListConfigFareByCompany(@Payload() companyId: string) {
//     try {
//       const result =
//         await this.bmsConfigFareService.getListConfigFareByCompany(companyId);
//       return {
//         success: true,
//         statusCode: HttpStatus.OK,
//         message: 'Success',
//         result,
//       };
//     } catch (error) {
//       throw new RpcException({
//         success: false,
//         message: error.response?.message || 'Service error',
//         statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
//       });
//     }
//   }

//   @MessagePattern({ bms: 'DELETE_CONFIG_FARE' })
//   async deleteConfigFare(@Payload() configFareId: number) {
//     try {
//       const result =
//         await this.bmsConfigFareService.deleteConfigFare(configFareId);
//       return {
//         success: true,
//         statusCode: HttpStatus.OK,
//         message: 'Success',
//         result,
//       };
//     } catch (error) {
//       throw new RpcException({
//         success: false,
//         message: 'Service error',
//         statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
//       });
//     }
//   }

//   @MessagePattern({ bms: 'UPDATE_CONFIG_FARE' })
//   async updateConfigFare(
//     @Payload() payload: { id: number; data: DTO_RQ_ConfigFare },
//   ) {
//     try {
//       const result = await this.bmsConfigFareService.updateConfigFare(
//         payload.id,
//         payload.data,
//       );
//       return {
//         success: true,
//         statusCode: HttpStatus.OK,
//         message: 'Success',
//         result,
//       };
//     } catch (error) {
//       throw new RpcException({
//         success: false,
//         message: 'Service error',
//         statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
//       });
//     }
//   }
// }
