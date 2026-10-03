import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import * as userRepo from '../repositories/user.repository';
import { RegisterInput, LoginInput } from '../validators/auth.validators';

export class AuthError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode: number = 400
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

export async function registerUser(input: RegisterInput) {
  const existing = await userRepo.findUserByEmail(input.email);
  if (existing) {
    throw new AuthError('EMAIL_TAKEN', 'An account with this email already exists', 409);
  }

  const passwordHash = await bcrypt.hash(input.password, config.bcryptRounds);
  const user = await userRepo.createUser(input.email, passwordHash);
  return user;
}

export async function loginUser(input: LoginInput): Promise<{ token: string; user: { id: string; email: string } }> {
  const user = await userRepo.findUserByEmail(input.email);
  if (!user) {
    throw new AuthError('INVALID_CREDENTIALS', 'Invalid email or password', 401);
  }

  const passwordMatch = await bcrypt.compare(input.password, user.passwordHash);
  if (!passwordMatch) {
    throw new AuthError('INVALID_CREDENTIALS', 'Invalid email or password', 401);
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );

  return { token, user: { id: user.id, email: user.email } };
}

export async function getCurrentUser(userId: string) {
  const user = await userRepo.findUserById(userId);
  if (!user) {
    throw new AuthError('USER_NOT_FOUND', 'User not found', 404);
  }
  return user;
}
