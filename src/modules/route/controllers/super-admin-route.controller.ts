import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put } from "@nestjs/common";
import { UUIDParam } from "src/param/UUIDParam";
import { DTO_RQ_SuperAdminRoute } from "../dtos/request/super-admin-route.dto";
import { SuperAdminCreateRouteUseCase } from "../use-case/super-admin/create-route.usecase";
import { ResponseResult } from "src/shared/response/result";
import { SuperAdminGetAllRouteByCompanyUseCase } from "../use-case/super-admin/get-all-route-by-company.usecase";
import { SuperAdminUpdateRouteUseCase } from "../use-case/super-admin/update-route.usecase";
import { SuperAdminDeleteRouteUseCase } from "../use-case/super-admin/delete-route.usecase";

@Controller("super-admin-route")
export class SuperAdminRouteController {
    constructor(
        private readonly superAdminCreateRouteUseCase: SuperAdminCreateRouteUseCase,
        private readonly superAdminGetAllRouteByCompanyUseCase: SuperAdminGetAllRouteByCompanyUseCase,
        private readonly superAdminUpdateRouteUseCase: SuperAdminUpdateRouteUseCase,
        private readonly superAdminDeleteRouteUseCase: SuperAdminDeleteRouteUseCase,
    ) {}

    @Post('companies/:id/routes')
    async CreateRoute(@Param() param: UUIDParam, @Body() data: DTO_RQ_SuperAdminRoute) {
        const result = await this.superAdminCreateRouteUseCase.execute(param.id, data);
        return new ResponseResult(true, HttpStatus.CREATED, 'Success', result);
    }
    @Get('companies/:id/routes')
    async GetRoutes(@Param() param: UUIDParam) {
        const result = await this.superAdminGetAllRouteByCompanyUseCase.execute(param.id);
        return new ResponseResult(true, HttpStatus.OK, 'Success', result);
    }

    @Put('routes/:id')
    async UpdateRoute(@Param() param: UUIDParam, @Body() data: DTO_RQ_SuperAdminRoute) {
        const result = await this.superAdminUpdateRouteUseCase.execute(param.id, data);
        return new ResponseResult(true, HttpStatus.OK, 'Success', result);
    }

    @Delete('routes/:id')
    async DeleteRoute(@Param() param: UUIDParam) {
        const result = await this.superAdminDeleteRouteUseCase.execute(param.id);
        return new ResponseResult(true, HttpStatus.OK, 'Success', result);
    }
}