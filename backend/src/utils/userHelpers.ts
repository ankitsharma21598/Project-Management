import bcrypt from 'bcryptjs';
import { UserAttributes } from '../models/User';

export async function comparePassword(
  candidatePassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, hashedPassword);
}

export function toSafeUser(
  user: UserAttributes
): Omit<UserAttributes, 'password'> {
  const { password, ...safeUser } = user;
  
  return safeUser;
}
