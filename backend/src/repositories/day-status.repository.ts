import { prisma } from '../config/prisma';
import { toDateObject, formatDateToString } from '../utils/date.utils';

export interface DayStatusResult {
  date: string;
  status: string;
  updatedAt: Date;
  updatedBy: { email: string };
}

function mapDayStatus(ds: {
  date: Date;
  status: string;
  updatedAt: Date;
  updatedBy: { email: string };
}): DayStatusResult {
  return {
    date: formatDateToString(ds.date),
    status: ds.status,
    updatedAt: ds.updatedAt,
    updatedBy: ds.updatedBy,
  };
}

export async function findDayStatusByDate(dateStr: string): Promise<DayStatusResult | null> {
  const parts = dateStr.split('-').map(Number);
  const dateObj = toDateObject(parts[0], parts[1], parts[2]);

  const ds = await prisma.dayStatus.findUnique({
    where: { date: dateObj },
    include: { updatedBy: { select: { email: true } } },
  });

  if (!ds) return null;
  return mapDayStatus(ds);
}

export async function findDayStatusesByYear(year: number): Promise<DayStatusResult[]> {
  const start = toDateObject(year, 1, 1);
  const end = toDateObject(year, 12, 31);

  const statuses = await prisma.dayStatus.findMany({
    where: {
      date: { gte: start, lte: end },
    },
    include: { updatedBy: { select: { email: true } } },
    orderBy: { date: 'asc' },
  });

  return statuses.map(mapDayStatus);
}

export async function upsertDayStatus(
  dateStr: string,
  status: string,
  userId: string
): Promise<DayStatusResult> {
  const parts = dateStr.split('-').map(Number);
  const dateObj = toDateObject(parts[0], parts[1], parts[2]);

  const ds = await prisma.dayStatus.upsert({
    where: { date: dateObj },
    update: { status, updatedById: userId },
    create: { date: dateObj, status, updatedById: userId },
    include: { updatedBy: { select: { email: true } } },
  });

  return mapDayStatus(ds);
}

export async function deleteDayStatus(dateStr: string): Promise<boolean> {
  const parts = dateStr.split('-').map(Number);
  const dateObj = toDateObject(parts[0], parts[1], parts[2]);

  try {
    await prisma.dayStatus.delete({ where: { date: dateObj } });
    return true;
  } catch {
    return false;
  }
}
