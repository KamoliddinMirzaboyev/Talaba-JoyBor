import React from 'react';

interface SkeletonProps {
  className?: string;
  count?: number;
}

const Skeleton: React.FC<SkeletonProps> = ({ className = 'h-4 w-full', count = 1 }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className={`animate-pulse rounded-lg bg-surface-200 dark:bg-surface-800 ${className} ${i > 0 ? 'mt-2' : ''}`}
      />
    ))}
  </>
);

export default Skeleton;
