'use client';

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { dayStatusApi, ApiError } from '@/lib/api';
import { DayStatus } from '@/types';
import { formatFullDate, MONTH_NAMES_FULL, getDaysInMonth, isValidCalendarDate, formatDateString, getCurrentYear, getCurrentDateString } from '@/utils/date';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DayStatusDialog } from '@/components/calendar/DayStatusDialog';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export function DayStatusViewer() {
  const { user } = useAuth();
  const today = getCurrentDateString();
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedYear, setSelectedYear] = useState(getCurrentYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [status, setStatus] = useState<DayStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    const dateStr = formatDateString(selectedYear, selectedMonth, selectedDay);
    setSelectedDate(dateStr);
  }, [selectedYear, selectedMonth, selectedDay]);

  useEffect(() => {
    setIsLoading(true);
    setStatus(null);
    dayStatusApi.getByDate(selectedDate)
      .then((data) => {
        setStatus(data?.status || null);
      })
      .catch((err) => {
        if (err instanceof ApiError && err.status !== 400) {
          toast.error('Failed to load status');
        }
        setStatus(null);
      })
      .finally(() => setIsLoading(false));
  }, [selectedDate]);

  const currentYear = getCurrentYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);

  // If selected day exceeds days in new month, clamp it
  const clampedDay = Math.min(selectedDay, daysInMonth);

  const handleMonthChange = (m: number) => {
    setSelectedMonth(m);
    const maxDays = getDaysInMonth(m, selectedYear);
    if (selectedDay > maxDays) setSelectedDay(maxDays);
  };

  const handleYearChange = (y: number) => {
    setSelectedYear(y);
    const maxDays = getDaysInMonth(selectedMonth, y);
    if (selectedDay > maxDays) setSelectedDay(maxDays);
  };

  const handleSaved = (_date: string, newStatus: DayStatus) => {
    setStatus(newStatus);
  };

  const handleDeleted = () => {
    setStatus(null);
  };

  const getStatusBadgeVariant = (s: string): 'default' | 'success' | 'warning' | 'error' | 'info' => {
    if (s === 'Office') return 'info';
    if (s === 'Leave' || s === 'Sick leave') return 'error';
    if (s === 'Holiday') return 'warning';
    if (s === 'Work from home' || s === 'WFH') return 'success';
    return 'default';
  };

  return (
    <div className="max-w-xl mx-auto">
      {/* Date Picker Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Select a date</h2>

        {/* Year selector */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Year</label>
          <div className="flex gap-2 flex-wrap">
            {years.map((y) => (
              <button
                key={y}
                onClick={() => handleYearChange(y)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedYear === y
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        </div>

        {/* Month selector */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Month</label>
          <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-6">
            {MONTH_NAMES_FULL.map((name, idx) => (
              <button
                key={name}
                onClick={() => handleMonthChange(idx + 1)}
                className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedMonth === idx + 1
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {name.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>

        {/* Day selector */}
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Day</label>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDay(d)}
                className={`aspect-square rounded-lg text-sm font-medium transition-colors ${
                  clampedDay === d
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Status Result Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Selected date</p>
            <h2 className="text-xl font-bold text-gray-900">{formatFullDate(selectedDate)}</h2>
          </div>
          {user && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setEditDialogOpen(true)}
            >
              {status ? 'Edit Status' : 'Add Status'}
            </Button>
          )}
          {!user && (
            <Link
              href="/login"
              className="text-xs text-blue-600 hover:underline font-medium"
            >
              Login to edit
            </Link>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : status ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-500">Status:</span>
              <Badge variant={getStatusBadgeVariant(status.status)}>
                {status.status}
              </Badge>
            </div>
            <div className="text-xs text-gray-400">
              Last updated by {status.updatedBy.email}
            </div>
          </div>
        ) : (
          <EmptyState
            title="No status entered"
            description="No status has been entered for this date."
            action={
              user ? (
                <Button size="sm" onClick={() => setEditDialogOpen(true)}>
                  Add Status
                </Button>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 border border-blue-200 rounded-md hover:bg-blue-50 transition-colors"
                >
                  Login to add status
                </Link>
              )
            }
          />
        )}
      </div>

      {user && (
        <DayStatusDialog
          isOpen={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          date={selectedDate}
          currentStatus={status || undefined}
          onSaved={handleSaved}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  );
}
