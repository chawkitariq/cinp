import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedRequest } from './jwt-auth.guard';
import { User } from 'src/user/entities/user.entity';

/**
 * Injects the authenticated user entity attached by JwtAuthGuard.
 *
 * @typeParam Key Optional user property key to read from the hydrated entity.
 * @param data Optional property name to extract from the authenticated user.
 * @param context Nest execution context for the current request.
 * @returns The full user entity or the selected user property.
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
