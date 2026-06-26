import * as bcrypt from 'bcrypt';

const saltRounds = 12;

/**
 * Hashes a plain password with bcrypt.
 *
 * @param password Plain-text password to hash.
 * @returns A promise that resolves to the bcrypt hash.
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, saltRounds);
}

/**
 * Compares a plain password against the persisted credential hash.
 *
 * @param password Plain-text password provided by the caller.
 * @param hashedPassword Previously persisted bcrypt hash.
 * @returns A promise that resolves to `true` when the passwords match.
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}
