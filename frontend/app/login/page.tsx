'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Sign in</h1>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to manage day statuses
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <LoginForm onSuccess={() => router.push('/dashboard')} />

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Demo credentials:{' '}
              <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">
                demo@example.com / Demo1234!
              </span>
            </p>
          </div>
        </div>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-medium text-blue-600 hover:underline">
            Create one
          </Link>
        </p>
        <p className="mt-2 text-center text-sm">
          <Link href="/" className="text-gray-500 hover:text-gray-700">
            ← Back to viewer
          </Link>
        </p>
      </div>
    </div>
  );
}
