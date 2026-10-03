'use client';

import { useState, useEffect, useCallback } from 'react';
import { dayStatusApi, ApiError } from '@/lib/api';
import { DayStatus } from '@/types';

interface StatusMap {
  [date: string]: DayStatus;
}

export function useDayStatuses(year: number) {
  const [statuses, setStatuses] = useState<StatusMap>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatuses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await dayStatusApi.getByYear(year);
      const map: StatusMap = {};
      data.statuses.forEach((s) => { map[s.date] = s; });
      setStatuses(map);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to load statuses');
      }
    } finally {
      setIsLoading(false);
    }
  }, [year]);

  useEffect(() => { fetchStatuses(); }, [fetchStatuses]);

  const updateStatus = useCallback((date: string, status: DayStatus) => {
    setStatuses((prev) => ({ ...prev, [date]: status }));
  }, []);

  const removeStatus = useCallback((date: string) => {
    setStatuses((prev) => {
      const next = { ...prev };
      delete next[date];
      return next;
    });
  }, []);

  return { statuses, isLoading, error, refetch: fetchStatuses, updateStatus, removeStatus };
}
