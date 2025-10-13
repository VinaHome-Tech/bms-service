import { Controller, HttpStatus } from "@nestjs/common";
import { BmsPointService } from "./bms_point.service";
import { MessagePattern, Payload, RpcException } from "@nestjs/microservices";

@Controller()
export class BmsPointController {
    constructor(private readonly bmsPointService: BmsPointService) { }

    @MessagePattern({ bms: 'GET_LIST_POINT_NAME_BY_ROUTE' })
    async getListPointNameByRoute(@Payload() data: number) {
        try {
            const result = await this.bmsPointService.getListPointNameByRoute(data);
            return {
                success: true,
                statusCode: HttpStatus.OK,
                message: 'Success',
                result,
            };
        } catch (error) {
            throw new RpcException({
                success: false,
                message: error.response?.message || 'Service error',
                statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
            });
        }
    }
}