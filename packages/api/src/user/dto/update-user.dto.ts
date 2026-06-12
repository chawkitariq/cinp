import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

/**
 * Partial request contract for updating a platform user account.
 */
export class UpdateUserDto extends PartialType(CreateUserDto) {}
