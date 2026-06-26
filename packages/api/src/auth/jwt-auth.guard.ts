import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { IS_PUBLIC_KEY } from './public.decorator';
import { User } from 'src/user/entities/user.entity';

/**
 * Authenticated JWT payload attached to requests after guard validation.
 */
export interface JwtAuthPayload {
  sub: string;
  email: string;
  isRecruiter: boolean;
}

/**
 * Express request enriched with the authenticated user entity.
 */
export interface AuthenticatedRequest extends Request {
  user: User;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Validates a bearer token and attaches its user entity to the current request.
   *
   * @param context Nest execution context for the current request.
   * @returns A promise that resolves to `true` when the request is authorized.
   * @throws {UnauthorizedException} When the token is missing, invalid, or the user no longer exists.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Bearer token is required');
    }

    const payload = await this.verifyToken(token);
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException('Authenticated user was not found');
    }

    request.user = user;

    return true;
  }

  /**
   * Verifies a bearer token and returns its decoded payload.
   *
   * @param token Raw bearer token extracted from the request header.
   * @returns A promise that resolves to the decoded JWT payload.
   * @throws {UnauthorizedException} When the token signature or shape is invalid.
   */
  private async verifyToken(token: string): Promise<JwtAuthPayload> {
    try {
      return await this.jwtService.verifyAsync<JwtAuthPayload>(token);
    } catch {
      throw new UnauthorizedException('Invalid bearer token');
    }
  }

  /**
   * Extracts a bearer token from the authorization header.
   *
   * @param request Incoming HTTP request.
   * @returns The raw token when the header contains a bearer credential.
   */
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
