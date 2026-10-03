import { Request, Response, NextFunction } from 'express';
import { registerSchema, loginSchema } from '../validators/auth.validators';
import * as authService from '../services/auth.service';
import { sendSuccess, sendError } from '../utils/response.utils';
import { config } from '../config';

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      sendError(res, 400, 'VALIDATION_ERROR', 'Invalid input', parsed.error.flatten());
      return;
    }

    const user = await authService.registerUser(parsed.data);
    sendSuccess(res, { user }, 201);
  } catch (err) {
    if (err instanceof authService.AuthError) {
      sendError(res, err.statusCode, err.code, err.message);
      return;
    }
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      sendError(res, 400, 'VALIDATION_ERROR', 'Invalid input', parsed.error.flatten());
      return;
    }

    const { token, user } = await authService.loginUser(parsed.data);

    res.cookie('token', token, config.cookie);
    sendSuccess(res, { user });
  } catch (err) {
    if (err instanceof authService.AuthError) {
      sendError(res, err.statusCode, err.code, err.message);
      return;
    }
    next(err);
  }
}

export async function logout(_req: Request, res: Response): Promise<void> {
  res.clearCookie('token', { path: '/' });
  sendSuccess(res, { message: 'Logged out successfully' });
}

export async function me(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      sendError(res, 401, 'UNAUTHORIZED', 'Not authenticated');
      return;
    }
    const user = await authService.getCurrentUser(req.user.id);
    sendSuccess(res, { user });
  } catch (err) {
    if (err instanceof authService.AuthError) {
      sendError(res, err.statusCode, err.code, err.message);
      return;
    }
    next(err);
  }
}
