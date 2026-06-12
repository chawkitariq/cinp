import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from './jwt-auth.guard';
import { User } from 'src/user/entities/user.entity';

describe('JwtAuthGuard', () => {
  let reflector: jest.Mocked<Pick<Reflector, 'getAllAndOverride'>>;
  let jwtService: jest.Mocked<Pick<JwtService, 'verifyAsync'>>;
  let userRepository: jest.Mocked<Pick<Repository<User>, 'findOne'>>;
  let guard: JwtAuthGuard;

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(false),
    };
    jwtService = {
      verifyAsync: jest.fn(),
    };
    userRepository = {
      findOne: jest.fn(),
    };
    guard = new JwtAuthGuard(
      reflector as Reflector,
      jwtService as JwtService,
      userRepository as Repository<User>,
    );
  });

  it('allows public endpoints without reading a bearer token', async () => {
    reflector.getAllAndOverride.mockReturnValue(true);

    await expect(
      guard.canActivate(createContext({ headers: {} })),
    ).resolves.toBe(true);

    expect(jwtService.verifyAsync).not.toHaveBeenCalled();
    expect(userRepository.findOne).not.toHaveBeenCalled();
  });

  it('validates bearer tokens and attaches the authenticated user to the request', async () => {
    const request = {
      headers: {
        authorization: 'Bearer valid-token',
      },
    };
    const payload = {
      sub: 'user-id',
      email: 'user@example.com',
      isRecruiter: true,
    };
    const user = Object.assign(new User(), {
      id: 'user-id',
      email: 'user@example.com',
      isRecruiter: true,
    });
    jwtService.verifyAsync.mockResolvedValue(payload);
    userRepository.findOne.mockResolvedValue(user);

    await expect(guard.canActivate(createContext(request))).resolves.toBe(true);

    expect(jwtService.verifyAsync).toHaveBeenCalledWith('valid-token');
    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { id: 'user-id' },
    });
    expect(request).toEqual({
      headers: {
        authorization: 'Bearer valid-token',
      },
      user,
    });
  });

  it('rejects valid tokens when the user no longer exists', async () => {
    jwtService.verifyAsync.mockResolvedValue({
      sub: 'missing-user-id',
      email: 'missing@example.com',
      isRecruiter: true,
    });
    userRepository.findOne.mockResolvedValue(null);

    await expect(
      guard.canActivate(
        createContext({
          headers: {
            authorization: 'Bearer valid-token',
          },
        }),
      ),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rejects requests without bearer tokens', async () => {
    await expect(
      guard.canActivate(createContext({ headers: {} })),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rejects invalid bearer tokens', async () => {
    jwtService.verifyAsync.mockRejectedValue(new Error('bad token'));

    await expect(
      guard.canActivate(
        createContext({
          headers: {
            authorization: 'Bearer invalid-token',
          },
        }),
      ),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  function createContext(request: unknown): ExecutionContext {
    return {
      getClass: () => JwtAuthGuard,
      getHandler: () => createContext,
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as ExecutionContext;
  }
});
