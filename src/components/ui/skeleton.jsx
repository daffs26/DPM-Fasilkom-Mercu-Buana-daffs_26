import React from 'react';

/**
 * Base Skeleton component with shimmer animation.
 */
export function Skeleton({ className = '', ...props }) {
  return (
    <div
      className={`animate-shimmer bg-slate-200/40 rounded-xl ${className}`}
      {...props}
    />
  );
}

export function SkeletonText({ lines = 2, className = '', lineClassName = 'h-3' }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`${lineClassName} ${i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'}`}
        />
      ))}
    </div>
  );
}

export function SkeletonBadge({ className = 'w-16 h-5' }) {
  return <Skeleton className={`rounded-full ${className}`} />;
}

export function SkeletonButton({ className = 'w-24 h-9' }) {
  return <Skeleton className={`rounded-xl ${className}`} />;
}

export function SkeletonCard({ className = '', children }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-100 p-5 shadow-2xs ${className}`}>
      {children}
    </div>
  );
}

export function SkeletonHeader({ hasActions = true }) {
  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-2">
        <Skeleton className="w-56 h-6" />
        <Skeleton className="w-80 h-4" />
      </div>
      {hasActions && (
        <div className="flex items-center gap-2">
          <SkeletonButton className="w-32 h-10" />
          <SkeletonButton className="w-28 h-10" />
        </div>
      )}
    </div>
  );
}

export function SkeletonTable({ rows = 5 }) {
  return (
    <SkeletonCard className="p-6 space-y-4">
      <div className="flex justify-between items-center mb-2">
        <Skeleton className="w-48 h-5" />
        <Skeleton className="w-28 h-8 rounded-lg" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center justify-between p-3 border-b border-slate-50 last:border-none">
            <div className="flex items-center gap-3">
              <Skeleton className="w-9 h-9 rounded-xl" />
              <div className="space-y-1.5">
                <Skeleton className="w-48 h-4" />
                <Skeleton className="w-32 h-3" />
              </div>
            </div>
            <SkeletonBadge className="w-24 h-6" />
          </div>
        ))}
      </div>
    </SkeletonCard>
  );
}

// 1. Dashboard Skeleton
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} className="p-5 space-y-3">
            <div className="flex justify-between">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <SkeletonBadge className="w-20 h-5" />
            </div>
            <Skeleton className="w-24 h-4" />
            <Skeleton className="w-32 h-8" />
          </SkeletonCard>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SkeletonTable rows={4} />
        </div>
        <SkeletonCard className="p-6 space-y-4">
          <Skeleton className="w-36 h-5" />
          <div className="flex justify-center my-6">
            <Skeleton className="w-32 h-32 rounded-full" />
          </div>
          <SkeletonText lines={3} />
        </SkeletonCard>
      </div>
    </div>
  );
}

// 2. Proker Skeleton
export function ProkerSkeleton() {
  return (
    <div className="space-y-6">
      <SkeletonHeader />
      <div className="flex gap-3">
        <Skeleton className="w-full sm:w-80 h-11 rounded-2xl" />
        <Skeleton className="w-32 h-11 rounded-2xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} className="h-64 p-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between">
                <SkeletonBadge className="w-20 h-6" />
                <Skeleton className="w-8 h-8 rounded-lg" />
              </div>
              <Skeleton className="w-3/4 h-5" />
              <SkeletonText lines={2} />
            </div>
            <div className="pt-4 border-t border-slate-100 flex justify-between">
              <Skeleton className="w-24 h-4" />
              <Skeleton className="w-20 h-4" />
            </div>
          </SkeletonCard>
        ))}
      </div>
    </div>
  );
}

// 3. Anggaran Skeleton
export function AnggaranSkeleton() {
  return (
    <div className="space-y-6">
      <SkeletonHeader />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonCard key={i} className="p-5 space-y-2">
            <Skeleton className="w-24 h-4" />
            <Skeleton className="w-36 h-7" />
          </SkeletonCard>
        ))}
      </div>
      <SkeletonTable rows={6} />
    </div>
  );
}

// 4. Audit Skeleton
export function AuditSkeleton() {
  return (
    <div className="space-y-6">
      <SkeletonHeader />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SkeletonTable rows={4} />
        <SkeletonTable rows={4} />
      </div>
    </div>
  );
}

// 5. Kalender Skeleton
export function KalenderSkeleton() {
  return (
    <div className="space-y-6">
      <SkeletonHeader />
      <SkeletonCard className="p-6">
        <div className="grid grid-cols-7 gap-3">
          {Array.from({ length: 35 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      </SkeletonCard>
    </div>
  );
}

// 6. Berkas Skeleton
export function BerkasSkeleton() {
  return (
    <div className="space-y-6">
      <SkeletonHeader />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} className="p-4 flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-xl" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="w-3/4 h-4" />
              <Skeleton className="w-1/2 h-3" />
            </div>
          </SkeletonCard>
        ))}
      </div>
    </div>
  );
}

// 7. Template Skeleton
export function TemplateSkeleton() {
  return <BerkasSkeleton />;
}

// 8. Surat Peringatan Skeleton
export function SuratPeringatanSkeleton() {
  return (
    <div className="space-y-6">
      <SkeletonHeader />
      <SkeletonTable rows={5} />
    </div>
  );
}

// 9. History Skeleton
export function HistorySkeleton() {
  return (
    <div className="space-y-6">
      <SkeletonHeader />
      <SkeletonTable rows={6} />
    </div>
  );
}

// 10. Generic Page Skeleton
export function GenericPageSkeleton() {
  return (
    <div className="space-y-6">
      <SkeletonHeader />
      <SkeletonTable rows={5} />
    </div>
  );
}

export default Skeleton;
