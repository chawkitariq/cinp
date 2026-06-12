import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

/**
 * Authenticated JWT payload attached to requests after guard validation.
 */
export interface JwtAuthPayload {
  sub: string;
  email: string;
  isRecruiter: boolean;
}

/**
 * Express request enriched by the JWT auth guard.
 */
export interface AuthenticatedRequest extends Request {
  user: JwtAuthPayload;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * Validates a bearer token and attaches its payload to the current request.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Bearer token is required');
    }

    try {
      request.user = await this.jwtService.verifyAsync<JwtAuthPayload>(token);
    } catch {
      throw new UnauthorizedException('Invalid bearer token');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
