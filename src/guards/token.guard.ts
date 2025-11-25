import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express'; // ✅ THÊM IMPORT NÀY
import { Observable } from 'rxjs';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      console.warn('Không tìm thấy token trong header');
      throw new UnauthorizedException('Không tìm thấy token trong header');
    }

    try {
      const payload = this.jwtService.verify(token, {
        clockTolerance: 5,
      });

      (request as any).account_id = payload.sub;
      (request as any).role = payload.role;

      if (requiredRoles && !requiredRoles.includes(payload.role as string)) {
        console.warn('❌ Vai trò không đủ quyền:', payload.role);
        throw new UnauthorizedException('Không đủ quyền truy cập API');
      }
    } catch (error) {
      console.error('❌ Token verify error:', error.name, error.message);

      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token đã hết hạn');
      }

      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Token không hợp lệ');
      }

      throw error;
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers?.authorization;
    if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      return token;
    }
    return undefined;
  }
}
