import { IsEmail, IsString, MinLength } from 'class-validator';

/**
 * Request contract for exchanging credentials for a JWT.
 */
export class LoginDto {
  @IsEmail()
  email: string;

  /**
   * Plain password compared against the stored credential hash.
   */
  @IsString()
  @MinLength(8)
  password: string;
}
