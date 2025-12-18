import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class TimingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const start = process.hrtime.bigint();

    return next.handle().pipe(
      tap(() => {
        const end = process.hrtime.bigint();
        const durationMs = Number(end - start) / 1_000_000;

        console.log(
          `[${req.method}] - ${durationMs.toFixed(2)} ms`,
        );
      }),
    );
  }
}
