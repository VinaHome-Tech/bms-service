// import { Controller, HttpStatus } from '@nestjs/common';
// import { PlatformPointService } from './platform_point.service';
// import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
// import { DTO_RQ_Point } from './point.dto';

// @Controller()
// export class PlatformPointController {
//   constructor(private readonly platformPointService: PlatformPointService) {}

//   @MessagePattern({ bms: 'import_province' })
//   async importProvince() {
//     return this.platformPointService.importProvince();
//   }

//   @MessagePattern({ bms: 'import_ward' })
//   async importWard() {
//     return this.platformPointService.importWard();
//   }

//   @MessagePattern({ vht: 'GET_PROVINCES' })
//   async getProvinces() {
//     try {
//       const result = await this.platformPointService.getProvinces();
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

//   @MessagePattern({ vht: 'GET_WARDS_BY_PROVINCE_CODE' })
//   async getWardsByProvinceCode(@Payload() provinceCode: number) {
//     try {
//       const result = await this.platformPointService.getWardsByProvinceCode(provinceCode);
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

//   @MessagePattern({ vht: 'CREATE_POINT' })
//   async createPoint(@Payload() data: DTO_RQ_Point) {
//     try {
//       const result = await this.platformPointService.createPoint(data);
//       return {
//         success: true,
//         statusCode: HttpStatus.CREATED,
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

//   @MessagePattern({ vht: 'GET_LIST_POINT' })
//   async getListPoint() {
//     try {
//       const result = await this.platformPointService.getListPoint();
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

//   @MessagePattern({ vht: 'DELETE_POINT' })
//   async deletePoint(@Payload() id: number) {
//     try {
//       const result = await this.platformPointService.deletePoint(id);
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

//   @MessagePattern({ vht: 'UPDATE_POINT' })
//   async updatePoint(@Payload() payload: { id: number; data: DTO_RQ_Point }) {
//     try {
//       const result = await this.platformPointService.updatePoint(payload.id, payload.data); 
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

//   @MessagePattern({ vht: 'GET_LIST_POINT_NAME' })
//   async getListPointName() {
//     try {
//       const result = await this.platformPointService.getListPointName();
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
// }
