'use client';

import React, { useState } from 'react';
import clsx from 'clsx';
import { CalendarCell } from './CalendarCell';
import { DayStatusDialog } from './DayStatusDialog';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { MONTH_NAMES, isValidCalendarDate, formatDateString } from '@/utils/date';
import { DayStatus } from '@/types';

interface CalendarGridProps {
  year: number;
  statuses: Record<string, DayStatus>;
  isLoading: boolean;
  error: string | null;
  onRefetch: () => void;
  onStatusSaved: (date: string, status: DayStatus) => void;
  onStatusDeleted: (date: string) => void;
  isEditable: boolean;
}

export function CalendarGrid({
  year,
  statuses,
  isLoading,
  error,
  onRefetch,
  onStatusSaved,
  onStatusDeleted,
  isEditable,
}: CalendarGridProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCellClick = (date: string) => {
    setSelectedDate(date);
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setSelectedDate(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-24">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={onRefetch} />;
  }

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full table-fixed border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th
                scope="col"
                className="sticky left-0 z-10 bg-gray-50 border-r border-gray-200
                  w-14 px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                Day
              </th>
              {MONTH_NAMES.map((month) => (
                <th
                  key={month}
                  scope="col"
                  className="min-w-[90px] px-2 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center"
                >
                  {month}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
              <tr
                key={day}
                className={clsx(
                  day % 2 === 0 ? 'bg-gray-50/30' : 'bg-white',
                  'hover:bg-blue-50/20 transition-colors'
                )}
              >
                {/* Day column - sticky */}
                <td
                  className="sticky left-0 z-10 border-r border-gray-200 bg-inherit px-3 py-2
                    text-xs font-semibold text-gray-600 text-center"
                >
                  {day}
                </td>

                {/* Month columns */}
                {Array.from({ length: 12 }, (_, m) => m + 1).map((month) => {
                  const valid = isValidCalendarDate(year, month, day);
                  const dateStr = valid ? formatDateString(year, month, day) : '';
                  const status = valid ? statuses[dateStr] : undefined;

                  return (
                    <CalendarCell
                      key={month}
                      isValid={valid}
                      status={status}
                      isEditable={isEditable}
                      onClick={valid && isEditable ? () => handleCellClick(dateStr) : undefined}
                    />
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isEditable && (
        <DayStatusDialog
          isOpen={dialogOpen}
          onClose={handleClose}
          date={selectedDate}
          currentStatus={selectedDate ? statuses[selectedDate] : undefined}
          onSaved={onStatusSaved}
          onDeleted={onStatusDeleted}
        />
      )}
    </>
  );
}
