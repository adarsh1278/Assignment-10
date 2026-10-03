'use client';

import React from 'react';
import clsx from 'clsx';
import { DayStatus } from '@/types';

interface CalendarCellProps {
  isValid: boolean;
  status?: DayStatus;
  onClick?: () => void;
  isEditable?: boolean;
}

export function CalendarCell({ isValid, status, onClick, isEditable = false }: CalendarCellProps) {
  if (!isValid) {
    return (
      <td className="px-2 py-2 border border-gray-100 bg-gray-50/70">
        <span className="block h-6" aria-hidden="true" />
      </td>
    );
  }

  const hasStatus = Boolean(status);

  return (
    <td
      className={clsx(
        'px-2 py-2 border border-gray-200 text-xs',
        'transition-colors duration-100',
        isEditable && 'cursor-pointer hover:bg-blue-50',
        !isEditable && hasStatus && 'cursor-default',
        !hasStatus && 'text-gray-400'
      )}
      onClick={isEditable ? onClick : undefined}
      title={status?.status}
    >
      {hasStatus ? (
        <span
          className={clsx(
            'block truncate max-w-[80px] font-medium',
            status?.status === 'Office' && 'text-blue-700',
            status?.status === 'Leave' && 'text-red-600',
            status?.status === 'Holiday' && 'text-purple-600',
            status?.status === 'Work from home' && 'text-green-600',
            status?.status === 'WFH' && 'text-green-600',
            !['Office', 'Leave', 'Holiday', 'Work from home', 'WFH'].includes(status?.status || '') &&
              'text-gray-700'
          )}
        >
          {status?.status}
        </span>
      ) : (
        isEditable ? (
          <span className="block text-gray-300 text-center text-lg leading-none">+</span>
        ) : null
      )}
    </td>
  );
}
