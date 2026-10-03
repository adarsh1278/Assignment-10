'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useDayStatuses } from '@/hooks/useDayStatuses';
import { CalendarGrid } from '@/components/calendar/CalendarGrid';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { NavBar } from '@/components/layout/NavBar';
import { getCurrentYear } from '@/utils/date';
import { DayStatus } from '@/types';

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const currentYear = getCurrentYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const { statuses, isLoading, error, refetch, updateStatus, removeStatus } = useDayStatuses(selectedYear);

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) return null;

  const handleStatusSaved = (date: string, status: DayStatus) => {
    updateStatus(date, status);
  };

  const handleStatusDeleted = (date: string) => {
    removeStatus(date);
  };

  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="max-w-[1400px] mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Manage day statuses for {selectedYear}</p>
          </div>

          {/* Year selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 font-medium">Year:</span>
            <div className="flex gap-1">
              {years.map((y) => (
                <button
                  key={y}
                  onClick={() => setSelectedYear(y)}
                  className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${
                    selectedYear === y
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Tip:</strong> Click any cell to add or edit a status. Greyed-out cells are invalid dates for that month.
          </p>
        </div>

        {/* Calendar Grid */}
        <CalendarGrid
          year={selectedYear}
          statuses={statuses}
          isLoading={isLoading}
          error={error}
          onRefetch={refetch}
          onStatusSaved={handleStatusSaved}
          onStatusDeleted={handleStatusDeleted}
          isEditable={true}
        />
      </main>
    </div>
  );
}
