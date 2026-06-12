import { IsEmail, IsString, MinLength } from 'class-validator';

/**
 * Request contract for creating an account and receiving a JWT.
 */
export class RegisterDto {
  @IsEmail()
  email: string;

  /**
   * Plain password used only to create a hashed credential.
   */
  @IsString()
  @MinLength(8)
  password: string;
}
