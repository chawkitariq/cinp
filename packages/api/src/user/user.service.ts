import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Creates a user account after enforcing unique email ownership.
   *
   * @param createUserDto Validated user creation payload.
   * @returns A promise that resolves to the saved user entity.
   * @throws {ConflictException} When another account already uses the email.
   */
  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email is already used');
    }

    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  /**
   * Lists all non-filtered user records visible to the repository.
   *
   * @returns A promise that resolves to every persisted user entity.
   */
  findAll() {
    return this.userRepository.find();
  }

  /**
   * Finds a user by UUID or throws when the account does not exist.
   *
   * @param id The user UUID to load.
   * @returns A promise that resolves to the matching user entity.
   * @throws {NotFoundException} When the user does not exist.
   */
  async findOne(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    return user;
  }

  /**
   * Updates a user while preventing email collisions with other accounts.
   *
   * @param id The UUID of the user to update.
   * @param updateUserDto Partial user payload validated by NestJS.
   * @returns A promise that resolves to the saved user entity.
   * @throws {ConflictException} When another account already uses the email.
   * @throws {NotFoundException} When the user does not exist.
   */
  async update(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });

      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Email is already used');
      }
    }

    const user = await this.userRepository.preload({
      id,
      ...updateUserDto,
    });

    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    return this.userRepository.save(user);
  }

  /**
   * Soft-deletes a user account after verifying it exists.
   *
   * @param id The UUID of the user to delete.
   * @returns A promise that resolves to a deletion confirmation payload.
   * @throws {NotFoundException} When the user does not exist.
   */
  async remove(id: string) {
    const user = await this.findOne(id);
    await this.userRepository.softRemove(user);
    return { deleted: true };
  }
}
