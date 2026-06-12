import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from 'src/user/entities/user.entity';
import { hashPassword, verifyPassword } from 'src/user/password.util';

/**
 * Response contract returned after successful authentication.
 */
export interface AuthResponse {
  accessToken: string;
  user: User;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Creates a user account and returns a signed bearer token.
   */
  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const email = registerDto.email.toLowerCase();
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email is already used');
    }

    const user = this.userRepository.create({
      email,
      password: await hashPassword(registerDto.password),
      isRecruiter: true,
    });
    const savedUser = await this.userRepository.save(user);

    return this.createAuthResponse(savedUser);
  }

  /**
   * Validates account credentials and returns a signed bearer token.
   */
  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const email = loginDto.email.toLowerCase();
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user || !(await verifyPassword(loginDto.password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.createAuthResponse(user);
  }

  private async createAuthResponse(user: User): Promise<AuthResponse> {
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      isRecruiter: user.isRecruiter,
    });

    return {
      accessToken,
      user,
    };
  }
}
