import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Creates a platform user account.
   *
   * @param createUserDto User creation payload validated by NestJS.
   * @returns A promise that resolves to the saved user entity.
   */
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  /**
   * Returns every user record.
   *
   * @returns A promise that resolves to every persisted user entity.
   */
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  /**
   * Returns one user by UUID.
   *
   * @param id The user UUID to load.
   * @returns A promise that resolves to the matching user entity.
   */
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.findOne(id);
  }

  /**
   * Updates a user account by UUID.
   *
   * @param id The user UUID to update.
   * @param updateUserDto Partial user payload validated by NestJS.
   * @returns A promise that resolves to the saved user entity.
   */
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  /**
   * Soft-deletes a user account by UUID.
   *
   * @param id The user UUID to delete.
   * @returns A promise that resolves to a deletion confirmation payload.
   */
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.remove(id);
  }
}
