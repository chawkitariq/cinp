import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

/**
 * Request contract for creating a platform user account.
 */
export class CreateUserDto {
  @IsEmail()
  email: string;

  /**
   * Plain password accepted by the current MVP API.
   */
  @IsString()
  @MinLength(8)
  password: string;

  /**
   * Grants recruiter authoring permissions when true.
   */
  @IsOptional()
  @IsBoolean()
  isRecruiter?: boolean;
}
