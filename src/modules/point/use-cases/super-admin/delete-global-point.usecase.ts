import { Injectable } from "@nestjs/common";
import { PointRepository } from "../../repositories/point.repository";

@Injectable()
export class DeleteGlobalPointUseCase {
    constructor(
        private readonly repo: PointRepository,
    ) {}
}