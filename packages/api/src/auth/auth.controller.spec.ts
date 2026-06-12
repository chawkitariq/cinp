import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<Pick<AuthService, 'register' | 'login'>>;

  beforeEach(async () => {
    authService = {
      register: jest.fn(),
      login: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('forwards register requests to the auth service', async () => {
    const dto = {
      email: 'user@example.com',
      password: 'password123',
    };

    await controller.register(dto);

    expect(authService.register).toHaveBeenCalledWith(dto);
  });

  it('forwards login requests to the auth service', async () => {
    const dto = {
      email: 'user@example.com',
      password: 'password123',
    };

    await controller.login(dto);

    expect(authService.login).toHaveBeenCalledWith(dto);
  });
});
