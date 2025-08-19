'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={cn('animate-spin rounded-full border-2 border-gray-300 border-t-primary-500', sizeClasses[size], className)} />
  );
};

interface PageLoadingProps {
  message?: string;
}

export const PageLoading: React.FC<PageLoadingProps> = ({
  message = 'Se încarcă...'
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <LoadingSpinner size="lg" />
      <p className="text-gray-600 text-lg">{message}</p>
    </div>
  );
};

export const SkeletonCard: React.FC = () => {
  return (
    <div className="animate-pulse bg-white rounded-xl shadow-card border border-gray-200 p-6">
      <div className="bg-gray-300 h-48 rounded-lg mb-4" />
      <div className="space-y-3">
        <div className="h-4 bg-gray-300 rounded w-3/4" />
        <div className="h-4 bg-gray-300 rounded w-1/2" />
        <div className="h-4 bg-gray-300 rounded w-full" />
        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-300 rounded w-1/4" />
          <div className="h-6 bg-gray-300 rounded w-1/3" />
        </div>
      </div>
    </div>
  );
};