import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { instanceToPlain } from 'class-transformer';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { User } from 'src/user/entities/user.entity';
import { hashPassword } from 'src/user/password.util';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: jest.Mocked<
    Pick<Repository<User>, 'create' | 'findOne' | 'save'>
  >;
  let jwtService: jest.Mocked<Pick<JwtService, 'signAsync'>>;

  beforeEach(async () => {
    userRepository = {
      create: jest.fn((user: Partial<User>) => Object.assign(new User(), user)),
      findOne: jest.fn(),
      save: jest.fn(),
    };
    jwtService = {
      signAsync: jest.fn().mockResolvedValue('signed.jwt.token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: userRepository,
        },
        {
          provide: JwtService,
          useValue: jwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('registers a user with a hashed password and returns a token', async () => {
    userRepository.findOne.mockResolvedValue(null);
    userRepository.save.mockImplementation((user) =>
      Promise.resolve(
        Object.assign(user, {
          id: 'user-id',
          isRecruiter: user.isRecruiter ?? false,
        }),
      ),
    );

    const result = await service.register({
      email: 'Recruiter@Example.com',
      password: 'password123',
    });

    expect(userRepository.create).toHaveBeenCalledWith({
      email: 'recruiter@example.com',
      password: expect.stringMatching(/^\$2[aby]\$/) as string,
      isRecruiter: true,
    });
    expect(result).toEqual({
      accessToken: 'signed.jwt.token',
      user: expect.objectContaining({
        id: 'user-id',
        email: 'recruiter@example.com',
        password: expect.any(String) as string,
        isRecruiter: true,
      }) as User,
    });
    expect(instanceToPlain(result.user)).toEqual({
      id: 'user-id',
      email: 'recruiter@example.com',
      isRecruiter: true,
    });
    expect(jwtService.signAsync).toHaveBeenCalledWith({
      sub: 'user-id',
      email: 'recruiter@example.com',
      isRecruiter: true,
    });
  });

  it('rejects registration when the email already exists', async () => {
    userRepository.findOne.mockResolvedValue({ id: 'existing-id' } as User);

    await expect(
      service.register({
        email: 'used@example.com',
        password: 'password123',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('logs in a user with valid credentials', async () => {
    userRepository.findOne.mockResolvedValue(
      Object.assign(new User(), {
        id: 'user-id',
        email: 'user@example.com',
        password: await hashPassword('password123'),
        isRecruiter: false,
      }),
    );

    const result = await service.login({
      email: 'USER@example.com',
      password: 'password123',
    });

    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { email: 'user@example.com' },
    });
    expect(result.accessToken).toBe('signed.jwt.token');
    expect(result.user).toEqual(
      expect.objectContaining({
        id: 'user-id',
        email: 'user@example.com',
        isRecruiter: false,
      }) as User,
    );
  });

  it('rejects login with invalid credentials', async () => {
    userRepository.findOne.mockResolvedValue(
      Object.assign(new User(), {
        password: await hashPassword('password123'),
      }),
    );

    await expect(
      service.login({
        email: 'user@example.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
