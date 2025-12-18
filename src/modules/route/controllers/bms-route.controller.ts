import { Body, Controller, Delete, Get, HttpStatus, NotFoundException, Param, Post, Put, UseGuards } from "@nestjs/common";
// import { DTO_RP_RouteName } from "../presentation/http/response/route-name.response";
import { Roles } from "src/decorator/roles.decorator";
import { UUIDParam } from "src/param/UUIDParam";
import { TokenGuard } from "src/guards/token.guard";
import { ResponseResult } from "src/shared/response/result";
import { DTO_RP_RouteName } from "../dtos/response/bms/route-name.dto";
import { GetRouteNameListByCompanyIdUseCase } from "../use-case/bms/get-route-name-list-by-company-id.usecase";
import { GetRouteListByCompanyIdUseCase } from "../use-case/bms/get-route-list-by-company-id.usecase";
import { GetRouteNameActionListByCompanyIdUseCase } from "../use-case/bms/get-route-name-action-list-by-company-id.usecase";
import { CreateRouteUseCase } from "../use-case/bms/create-route.usecase";
import { UpdateRouteUseCase } from "../use-case/bms/update-route.usecase";
import { DeleteRouteUseCase } from "../use-case/bms/delete-route.usecase";
import { DTO_RP_RouteNameToConfig } from "../dtos/response/bms/route-name-to-config.dto";
import { GetListRouteNameToConfigUseCase } from "../use-case/bms/get-list-route-name-to-config.usecase";
import { DTO_RQ_Route } from "../dtos/request/bms/route.dto";

@Controller('bms-route')
@UseGuards(TokenGuard)
export class BmsRouteController {
    constructor(
        private readonly getRouteNameListByCompanyId: GetRouteNameListByCompanyIdUseCase,
        private readonly getRouteListByCompanyId: GetRouteListByCompanyIdUseCase,
        private readonly getRouteNameActionListByCompanyId: GetRouteNameActionListByCompanyIdUseCase,
        private readonly createRouteUseCase: CreateRouteUseCase,
        private readonly updateRouteUseCase: UpdateRouteUseCase,
        private readonly deleteRouteUseCase: DeleteRouteUseCase,
        private readonly getListRouteNameToConfigUseCase: GetListRouteNameToConfigUseCase,
    ) { }

    @Get('companies/:id/route-names')
    @Roles('ADMIN', 'STAFF')
    async GetRouteNameListByCompanyId(
        @Param() param: UUIDParam,
    ): Promise<ResponseResult<DTO_RP_RouteName[]>> {
        const result = await this.getRouteNameListByCompanyId.execute(param.id);
        return new ResponseResult(true, HttpStatus.OK, 'Success', result);
    }

    @Get('companies/:id/route-names-action')
    @Roles('ADMIN', 'STAFF')
    async GetRouteNameActionListByCompanyId(
        @Param() param: UUIDParam,
    ): Promise<ResponseResult<DTO_RP_RouteName[]>> {
        const result = await this.getRouteNameActionListByCompanyId.execute(param.id);
        return new ResponseResult(true, HttpStatus.OK, 'Success', result);
    }

    @Get('companies/:id/routes')
    @Roles('ADMIN', 'STAFF')
    async GetRouteListByCompanyId(
        @Param() param: UUIDParam,
    ): Promise<ResponseResult<DTO_RP_RouteName[]>> {
        const result = await this.getRouteListByCompanyId.execute(param.id);
        return new ResponseResult(true, HttpStatus.OK, 'Success', result);
    }

    // M3_v2.F2
    @Post('companies/:id/routes')
    @Roles('ADMIN')
    async CreateRoute(@Param() param: UUIDParam, @Body() data: DTO_RQ_Route) {
        const result = await this.createRouteUseCase.execute(param.id, data);
        return new ResponseResult(true, HttpStatus.CREATED, 'Success', result);
    }

    // M3_v2.F3
    @Put(':id')
    @Roles('ADMIN')
    async UpdateRoute(
        @Param() param: UUIDParam,
        @Body() data: DTO_RQ_Route,
    ) {
        const result = await this.updateRouteUseCase.execute(param.id, data);
        return new ResponseResult(true, HttpStatus.OK, 'Success', result);
    }

    // M2_v2.F4
    @Delete(':id')
    @Roles('ADMIN')
    async DeleteRoute(@Param() param: any) {
        const result = await this.deleteRouteUseCase.execute(param.id);
        return new ResponseResult(true, HttpStatus.OK, 'Success', result);
    }

    @Get('companies/:id/route-name-to-config')
    @Roles('ADMIN')
    async GetRouteNameToConfigByCompanyId(
        @Param() param: UUIDParam,
    ): Promise<ResponseResult<DTO_RP_RouteNameToConfig[]>> {
        const result = await this.getListRouteNameToConfigUseCase.execute(param.id);
        return new ResponseResult(true, HttpStatus.OK, 'Success', result);
    }
}