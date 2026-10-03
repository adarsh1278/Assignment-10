import { Request, Response, NextFunction } from 'express';
import { createDayStatusSchema, updateDayStatusSchema, yearQuerySchema } from '../validators/day-status.validators';
import * as dayStatusService from '../services/day-status.service';
import { sendSuccess, sendError } from '../utils/response.utils';

export async function getByYear(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = yearQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      sendError(res, 400, 'VALIDATION_ERROR', 'Invalid year', parsed.error.flatten());
      return;
    }
    const statuses = await dayStatusService.getDayStatusesByYear(parsed.data.year);
    sendSuccess(res, { year: parsed.data.year, statuses });
  } catch (err) {
    next(err);
  }
}

export async function getByDate(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { date } = req.params;
    const status = await dayStatusService.getDayStatus(date);
    if (!status) {
      sendSuccess(res, null, 200);
      return;
    }
    sendSuccess(res, { status });
  } catch (err) {
    if (err instanceof dayStatusService.DayStatusError) {
      sendError(res, err.statusCode, err.code, err.message);
      return;
    }
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      sendError(res, 401, 'UNAUTHORIZED', 'Authentication required');
      return;
    }

    const parsed = createDayStatusSchema.safeParse(req.body);
    if (!parsed.success) {
      sendError(res, 400, 'VALIDATION_ERROR', 'Invalid input', parsed.error.flatten());
      return;
    }

    const result = await dayStatusService.createOrUpdateDayStatus(
      parsed.data.date,
      parsed.data.status,
      req.user.id
    );
    sendSuccess(res, { status: result }, 201);
  } catch (err) {
    if (err instanceof dayStatusService.DayStatusError) {
      sendError(res, err.statusCode, err.code, err.message);
      return;
    }
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      sendError(res, 401, 'UNAUTHORIZED', 'Authentication required');
      return;
    }

    const { date } = req.params;
    const parsed = updateDayStatusSchema.safeParse(req.body);
    if (!parsed.success) {
      sendError(res, 400, 'VALIDATION_ERROR', 'Invalid input', parsed.error.flatten());
      return;
    }

    const result = await dayStatusService.createOrUpdateDayStatus(
      date,
      parsed.data.status,
      req.user.id
    );
    sendSuccess(res, { status: result });
  } catch (err) {
    if (err instanceof dayStatusService.DayStatusError) {
      sendError(res, err.statusCode, err.code, err.message);
      return;
    }
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      sendError(res, 401, 'UNAUTHORIZED', 'Authentication required');
      return;
    }

    const { date } = req.params;
    await dayStatusService.deleteDayStatus(date);
    sendSuccess(res, { message: 'Day status deleted' });
  } catch (err) {
    if (err instanceof dayStatusService.DayStatusError) {
      sendError(res, err.statusCode, err.code, err.message);
      return;
    }
    next(err);
  }
}
