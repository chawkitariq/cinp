import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  let jwtService: jest.Mocked<Pick<JwtService, 'verifyAsync'>>;
  let guard: JwtAuthGuard;

  beforeEach(() => {
    jwtService = {
      verifyAsync: jest.fn(),
    };
    guard = new JwtAuthGuard(jwtService as JwtService);
  });

  it('validates bearer tokens and attaches the payload to the request', async () => {
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
    jwtService.verifyAsync.mockResolvedValue(payload);

    await expect(guard.canActivate(createContext(request))).resolves.toBe(true);

    expect(jwtService.verifyAsync).toHaveBeenCalledWith('valid-token');
    expect(request).toEqual({
      headers: {
        authorization: 'Bearer valid-token',
      },
      user: payload,
    });
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
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as ExecutionContext;
  }
});
