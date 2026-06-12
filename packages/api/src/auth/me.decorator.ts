import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedRequest } from './jwt-auth.guard';
import { User } from 'src/user/entities/user.entity';

/**
 * Injects the authenticated user entity attached by JwtAuthGuard.
 */
export const Me = createParamDecorator(
  <Key extends keyof User | undefined>(
    data: Key,
    context: ExecutionContext,
  ): Key extends keyof User ? User[Key] : User => {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    return (data ? user[data] : user) as Key extends keyof User
      ? User[Key]
      : User;
  },
);
