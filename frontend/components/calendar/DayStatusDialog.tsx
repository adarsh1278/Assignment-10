'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { dayStatusApi, ApiError } from '@/lib/api';
import { DayStatus } from '@/types';
import { formatFullDate } from '@/utils/date';

const statusSchema = z.object({
  status: z.string().min(1, 'Status is required').max(255, 'Status too long').trim(),
});

type StatusFormData = z.infer<typeof statusSchema>;

const STATUS_SUGGESTIONS = [
  'Office',
  'Work from home',
  'WFH',
  'Leave',
  'Holiday',
  'Meeting',
  'Project work',
  'Training',
  'Sick leave',
  'Available',
];

interface DayStatusDialogProps {
  isOpen: boolean;
  onClose: () => void;
  date: string | null;
  currentStatus?: DayStatus;
  onSaved: (date: string, status: DayStatus) => void;
  onDeleted?: (date: string) => void;
}

export function DayStatusDialog({
  isOpen,
  onClose,
  date,
  currentStatus,
  onSaved,
  onDeleted,
}: DayStatusDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<StatusFormData>({
    resolver: zodResolver(statusSchema),
    defaultValues: { status: currentStatus?.status || '' },
  });

  useEffect(() => {
    if (isOpen) {
      reset({ status: currentStatus?.status || '' });
    }
  }, [isOpen, currentStatus, reset]);

  const onSubmit = async (data: StatusFormData) => {
    if (!date) return;
    try {
      const result = currentStatus
        ? await dayStatusApi.update(date, data.status)
        : await dayStatusApi.create(date, data.status);
      onSaved(date, result.status);
      toast.success(currentStatus ? 'Status updated!' : 'Status created!');
      onClose();
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error('Failed to save status');
      }
    }
  };

  const handleDelete = async () => {
    if (!date || !currentStatus) return;
    setIsDeleting(true);
    try {
      await dayStatusApi.delete(date);
      onDeleted?.(date);
      toast.success('Status deleted');
      onClose();
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error('Failed to delete status');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  if (!date) return null;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={currentStatus ? 'Edit Status' : 'Add Status'}
    >
      <div className="mb-4">
        <p className="text-sm text-gray-500">
          {formatFullDate(date)}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <input
            id="status"
            type="text"
            {...register('status')}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm
              focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="e.g. Office, WFH, Leave"
            autoFocus
          />
          {errors.status && (
            <p className="mt-1 text-xs text-red-600">{errors.status.message}</p>
          )}
        </div>

        {/* Quick suggestions */}
        <div>
          <p className="text-xs text-gray-500 mb-2">Quick select:</p>
          <div className="flex flex-wrap gap-1.5">
            {STATUS_SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setValue('status', s)}
                className="px-2.5 py-1 text-xs rounded-full border border-gray-200 bg-gray-50
                  hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          {currentStatus && onDeleted ? (
            <Button
              type="button"
              variant="danger"
              size="sm"
              isLoading={isDeleting}
              onClick={handleDelete}
            >
              Delete
            </Button>
          ) : <div />}

          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {currentStatus ? 'Update' : 'Save'}
            </Button>
          </div>
        </div>
      </form>
    </Dialog>
  );
}
