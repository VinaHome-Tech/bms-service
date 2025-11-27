import { Injectable } from "@nestjs/common";

@Injectable()
export class GetRoutesNameToConfigUseCase {
    constructor() { }

    async execute(companyId: string) {
        console.log(`Executing GetRoutesNameToConfigUseCase for companyId: ${companyId}`);
    }
}