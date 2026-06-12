import * as bcrypt from 'bcrypt';

const saltRounds = 12;

/**
 * Hashes a plain password with bcrypt.
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, saltRounds);
}

/**
 * Compares a plain password against the persisted credential hash.
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}
