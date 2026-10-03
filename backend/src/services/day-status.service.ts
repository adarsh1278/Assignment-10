import * as repo from '../repositories/day-status.repository';
import { parseDateString } from '../utils/date.utils';

export class DayStatusError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode: number = 400
  ) {
    super(message);
    this.name = 'DayStatusError';
  }
}

export async function getDayStatus(dateStr: string) {
  if (!parseDateString(dateStr)) {
    throw new DayStatusError('INVALID_DATE', 'Invalid date format or value');
  }
  return repo.findDayStatusByDate(dateStr);
}

export async function getDayStatusesByYear(year: number) {
  return repo.findDayStatusesByYear(year);
}

export async function createOrUpdateDayStatus(dateStr: string, status: string, userId: string) {
  if (!parseDateString(dateStr)) {
    throw new DayStatusError('INVALID_DATE', 'Invalid date');
  }
  return repo.upsertDayStatus(dateStr, status, userId);
}

export async function deleteDayStatus(dateStr: string) {
  if (!parseDateString(dateStr)) {
    throw new DayStatusError('INVALID_DATE', 'Invalid date');
  }
  const deleted = await repo.deleteDayStatus(dateStr);
  if (!deleted) {
    throw new DayStatusError('NOT_FOUND', 'Day status not found', 404);
  }
  return true;
}
