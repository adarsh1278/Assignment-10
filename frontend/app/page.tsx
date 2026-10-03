import React from 'react';
import Link from 'next/link';
import { DayStatusViewer } from '@/components/day-status/DayStatusViewer';
import { NavBar } from '@/components/layout/NavBar';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <NavBar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Day Status Viewer</h1>
          <p className="text-gray-500 text-lg">Select a date to view its status</p>
        </div>
        <DayStatusViewer />
      </main>
    </div>
  );
}
