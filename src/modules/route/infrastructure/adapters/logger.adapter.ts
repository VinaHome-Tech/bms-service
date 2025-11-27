import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class LoggerAdapter {
  private readonly logger = new Logger("RouteModule");

  log(message: string) {
    this.logger.log(message);
  }

  error(message: string, trace?: string) {
    this.logger.error(message, trace);
  }
}