import React from 'react';

/**
 * Base Skeleton component with premium lightweight shimmer sweep animation.
 */
export function Skeleton({ className = '', ...props }) {
  return (
    <div
      className={`animate-shimmer bg-slate-200/40 rounded-xl ${className}`}
      {...props}
    />
  );
}

/**
 * Text lines placeholder helper
 */
export function SkeletonText({ lines = 2, className = '', lineClassName = 'h-3' }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`${lineClassName} ${
            i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'
          }`}
        />
      ))}
    </div>
  );
}

/**
 * Badge pill placeholder
 */
export function SkeletonBadge({ className = 'w-16 h-5' }) {
  return <Skeleton className={`rounded-full ${className}`} />;
}

/**
 * Button placeholder
 */
export function SkeletonButton({ className = 'w-24 h-9' }) {
  return <Skeleton className={`rounded-xl ${className}`} />;
}

/**
 * Container Card placeholder with standard surface styling
 */
export function SkeletonCard({ className = '', children }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-100 p-5 shadow-2xs ${className}`}>
      {children}
    </div>
  );
}

export default Skeleton;
