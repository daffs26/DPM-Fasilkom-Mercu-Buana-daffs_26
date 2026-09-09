import React from 'react';
import { Skeleton, SkeletonCard, SkeletonText, SkeletonBadge, SkeletonButton } from './skeleton';

/**
 * 1. Dashboard Skeleton
 * Mimics: 4 Hero KPI Cards -> Middle Row (Scorecard 2-col + Budget 1-col) -> Bottom Row (Proker Table 2-col + Activity Feed 1-col)
 */
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* 4 Hero KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} className="p-5">
            <div className="flex items-center justify-between mb-3">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <SkeletonBadge className="w-20 h-5" />
            </div>
            <Skeleton className="w-24 h-4 mb-2" />
            <Skeleton className="w-32 h-8 mb-2" />
            <Skeleton className="w-3/4 h-3" />
          </SkeletonCard>
        ))}
      </div>

      {/* Middle Row: Scorecard Ormawa (2-col) + Budget Card (1-col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SkeletonCard className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="space-y-2">
              <Skeleton className="w-48 h-6" />
              <Skeleton className="w-64 h-4" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="w-20 h-8 rounded-lg" />
              <Skeleton className="w-20 h-8 rounded-lg" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
          </div>
          <div className="space-y-3">
            <Skeleton className="w-full h-12 rounded-xl" />
            <Skeleton className="w-full h-12 rounded-xl" />
          </div>
        </SkeletonCard>

        <SkeletonCard className="lg:col-span-1 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="w-40 h-5" />
              <SkeletonBadge className="w-16 h-5" />
            </div>
            <div className="my-6 flex justify-center">
              <Skeleton className="w-36 h-36 rounded-full" />
            </div>
            <div className="space-y-2.5">
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-full h-2 rounded-full" />
            </div>
          </div>
          <div className="pt-4 border-t border-slate-100 mt-4 flex justify-between">
            <Skeleton className="w-24 h-4" />
            <Skeleton className="w-20 h-4" />
          </div>
        </SkeletonCard>
      </div>

      {/* Bottom Row: Proker Table (2-col) + Live Audit Feed (1-col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SkeletonCard className="lg:col-span-2 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div className="space-y-1.5">
              <Skeleton className="w-44 h-5" />
              <Skeleton className="w-56 h-3.5" />
            </div>
            <Skeleton className="w-32 h-9 rounded-xl" />
          </div>
          <div className="space-y-3">
            <Skeleton className="w-full h-10 rounded-lg" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 border-b border-slate-100 last:border-none">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-lg" />
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

        <SkeletonCard className="lg:col-span-1 p-6">
          <div className="flex items-center justify-between mb-5">
            <Skeleton className="w-36 h-5" />
            <Skeleton className="w-12 h-4" />
          </div>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="w-full h-3.5" />
                  <Skeleton className="w-24 h-3" />
                </div>
              </div>
            ))}
          </div>
        </SkeletonCard>
      </div>
    </div>
  );
}

/**
 * 2. Proker Skeleton
 * Mimics: Header Toolbar -> Filter & Search Bar -> Grid of Proker Cards
 */
export function ProkerSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Banner & Ormawa Filter Pills */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="w-56 h-6" />
            <Skeleton className="w-80 h-4" />
          </div>
          <div className="flex items-center gap-2">
            <SkeletonButton className="w-32 h-10" />
            <SkeletonButton className="w-28 h-10" />
          </div>
        </div>
        <div className="flex items-center gap-2 overflow-x-hidden pt-2 border-t border-slate-100">
          <Skeleton className="w-20 h-8 rounded-full" />
          <Skeleton className="w-24 h-8 rounded-full" />
          <Skeleton className="w-24 h-8 rounded-full" />
          <Skeleton className="w-28 h-8 rounded-full" />
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <Skeleton className="w-full sm:w-80 h-11 rounded-2xl" />
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Skeleton className="w-32 h-11 rounded-2xl" />
          <Skeleton className="w-36 h-11 rounded-2xl" />
        </div>
      </div>

      {/* Proker Card Grid (6 items) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} className="p-5 flex flex-col justify-between h-[280px]">
            <div>
              <div className="flex items-center justify-between mb-3">
                <SkeletonBadge className="w-20 h-6" />
                <SkeletonBadge className="w-24 h-6" />
              </div>
              <Skeleton className="w-3/4 h-5 mb-2" />
              <Skeleton className="w-full h-3.5 mb-1.5" />
              <Skeleton className="w-2/3 h-3.5 mb-4" />
              
              <div className="space-y-2 py-3 border-y border-slate-100 mb-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="w-28 h-3.5" />
                  <Skeleton className="w-24 h-3.5" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="w-24 h-3.5" />
                  <Skeleton className="w-20 h-3.5" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-2">
              <Skeleton className="w-24 h-4" />
              <div className="flex gap-2">
                <Skeleton className="w-8 h-8 rounded-lg" />
                <Skeleton className="w-20 h-8 rounded-lg" />
              </div>
            </div>
          </SkeletonCard>
        ))}
      </div>
    </div>
  );
}

/**
 * 3. Anggaran Skeleton
 * Mimics: Financial Header -> 4 KPI Cards -> Ormawa Grid -> Transaction Table
 */
export function AnggaranSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="w-48 h-6" />
            <SkeletonBadge className="w-20 h-5" />
          </div>
          <Skeleton className="w-72 h-4" />
        </div>
        <div className="flex items-center gap-2.5">
          <SkeletonButton className="w-28 h-10" />
          <SkeletonButton className="w-32 h-10" />
        </div>
      </div>

      {/* 4 Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} className="p-5">
            <div className="flex items-center justify-between mb-3">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <Skeleton className="w-12 h-4" />
            </div>
            <Skeleton className="w-24 h-3.5 mb-2" />
            <Skeleton className="w-36 h-7 mb-2" />
            <Skeleton className="w-full h-2 rounded-full" />
          </SkeletonCard>
        ))}
      </div>

      {/* Ormawa Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Skeleton className="w-8 h-8 rounded-lg" />
              <div className="space-y-1">
                <Skeleton className="w-20 h-4" />
                <Skeleton className="w-16 h-3" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="w-full h-3" />
              <Skeleton className="w-full h-2 rounded-full" />
            </div>
          </SkeletonCard>
        ))}
      </div>

      {/* Transaction / Proker Matrix Table */}
      <SkeletonCard className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex gap-2">
            <Skeleton className="w-32 h-9 rounded-xl" />
            <Skeleton className="w-32 h-9 rounded-xl" />
          </div>
          <Skeleton className="w-48 h-9 rounded-xl" />
        </div>
        <div className="space-y-3">
          <Skeleton className="w-full h-10 rounded-lg" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="w-full h-12 rounded-lg" />
          ))}
        </div>
      </SkeletonCard>
    </div>
  );
}

/**
 * 4. Audit Skeleton
 * Mimics: Parameter Standards -> Ormawa Report -> LPJ Audit Table
 */
export function AuditSkeleton() {
  return (
    <div className="space-y-6">
      {/* Parameter Standards Banner */}
      <SkeletonCard className="p-6">
        <div className="space-y-2 mb-5">
          <Skeleton className="w-64 h-6" />
          <Skeleton className="w-96 h-4" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4 rounded-xl border border-slate-100 space-y-2">
              <Skeleton className="w-8 h-8 rounded-lg" />
              <Skeleton className="w-24 h-4" />
              <SkeletonText lines={2} />
            </div>
          ))}
        </div>
      </SkeletonCard>

      {/* Ormawa Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonCard key={i} className="p-6 text-center">
            <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
            <Skeleton className="w-32 h-5 mx-auto mb-2" />
            <SkeletonBadge className="w-24 h-6 mx-auto mb-4" />
            <div className="space-y-2 pt-3 border-t border-slate-100">
              <Skeleton className="w-full h-3" />
              <Skeleton className="w-full h-3" />
            </div>
          </SkeletonCard>
        ))}
      </div>

      {/* Audit Proker Table */}
      <SkeletonCard className="p-6">
        <div className="flex items-center justify-between mb-5">
          <Skeleton className="w-48 h-5" />
          <Skeleton className="w-32 h-9 rounded-xl" />
        </div>
        <div className="space-y-3">
          <Skeleton className="w-full h-10 rounded-lg" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="w-full h-12 rounded-lg" />
          ))}
        </div>
      </SkeletonCard>
    </div>
  );
}

/**
 * 5. Kalender Skeleton
 * Mimics: Toolbar Navigation -> Calendar 7-col Grid + Sidebar
 */
export function KalenderSkeleton() {
  return (
    <div className="space-y-6">
      {/* Top Toolbar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <div className="space-y-1.5">
            <Skeleton className="w-40 h-5" />
            <Skeleton className="w-24 h-3.5" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="w-24 h-9 rounded-xl" />
          <Skeleton className="w-28 h-9 rounded-xl" />
        </div>
      </div>

      {/* Grid Kalender & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kalender 7-col Grid (2 cols on lg) */}
        <SkeletonCard className="lg:col-span-2 p-6">
          <div className="grid grid-cols-7 gap-2 mb-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-6 rounded-md" />
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="h-20 sm:h-24 p-2 rounded-xl border border-slate-100 flex flex-col justify-between">
                <Skeleton className="w-5 h-4" />
                <Skeleton className="w-full h-2 rounded-full" />
              </div>
            ))}
          </div>
        </SkeletonCard>

        {/* Sidebar Event List (1 col on lg) */}
        <SkeletonCard className="lg:col-span-1 p-6 space-y-4">
          <div className="space-y-2 pb-4 border-b border-slate-100">
            <Skeleton className="w-32 h-5" />
            <Skeleton className="w-48 h-3.5" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-3.5 rounded-xl border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <SkeletonBadge className="w-16 h-5" />
                  <Skeleton className="w-16 h-3" />
                </div>
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-2/3 h-3" />
              </div>
            ))}
          </div>
        </SkeletonCard>
      </div>
    </div>
  );
}

/**
 * 6. Berkas Skeleton
 * Mimics: Header Toolbar -> Left Folder Column + Right File Grid
 */
export function BerkasSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="w-44 h-6" />
          <Skeleton className="w-64 h-4" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="w-48 h-10 rounded-xl" />
          <SkeletonButton className="w-32 h-10" />
        </div>
      </div>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Folders (1 col) */}
        <SkeletonCard className="lg:col-span-1 p-4 space-y-2.5">
          <Skeleton className="w-24 h-4 mb-3" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="w-full h-11 rounded-xl" />
          ))}
        </SkeletonCard>

        {/* Right Column: Files Grid (3 cols) */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} className="p-4 flex flex-col justify-between h-48">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="w-10 h-10 rounded-xl" />
                  <SkeletonBadge className="w-16 h-5" />
                </div>
                <Skeleton className="w-4/5 h-4" />
                <Skeleton className="w-1/2 h-3" />
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <Skeleton className="w-20 h-3" />
                <Skeleton className="w-16 h-7 rounded-lg" />
              </div>
            </SkeletonCard>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * 7. Template Skeleton
 * Mimics: Header Search -> Category Pills Horizontal -> 6 Template Cards Grid
 */
export function TemplateSkeleton() {
  return (
    <div className="space-y-6">
      {/* Top Header & Search */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="w-48 h-6" />
          <Skeleton className="w-72 h-4" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="w-48 sm:w-64 h-10 rounded-xl" />
          <SkeletonButton className="w-32 h-10" />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-hidden pb-1">
        <Skeleton className="w-20 h-9 rounded-xl shrink-0" />
        <Skeleton className="w-28 h-9 rounded-xl shrink-0" />
        <Skeleton className="w-28 h-9 rounded-xl shrink-0" />
        <Skeleton className="w-32 h-9 rounded-xl shrink-0" />
        <Skeleton className="w-28 h-9 rounded-xl shrink-0" />
      </div>

      {/* Template Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} className="p-5 flex flex-col justify-between h-[230px]">
            <div>
              <div className="flex items-center justify-between mb-3">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <SkeletonBadge className="w-14 h-5" />
              </div>
              <Skeleton className="w-4/5 h-5 mb-2" />
              <SkeletonText lines={2} className="mb-4" />
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <Skeleton className="w-24 h-3.5" />
              <div className="flex gap-2">
                <Skeleton className="w-8 h-8 rounded-lg" />
                <Skeleton className="w-20 h-8 rounded-lg" />
              </div>
            </div>
          </SkeletonCard>
        ))}
      </div>
    </div>
  );
}

/**
 * 8. Surat Peringatan Skeleton
 * Mimics: Warning Overview Banner -> Filter Tabs -> SP Cards List
 */
export function SuratPeringatanSkeleton() {
  return (
    <div className="space-y-6">
      {/* Warning Overview Banner */}
      <SkeletonCard className="p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Skeleton className="w-11 h-11 rounded-2xl" />
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Skeleton className="w-48 h-5" />
                <SkeletonBadge className="w-20 h-5" />
              </div>
              <Skeleton className="w-64 h-3.5" />
            </div>
          </div>
          <div className="flex gap-2">
            <SkeletonButton className="w-28 h-10" />
            <SkeletonButton className="w-32 h-10" />
          </div>
        </div>
        <div className="flex gap-2 pt-2 border-t border-slate-100">
          <Skeleton className="w-20 h-8 rounded-full" />
          <Skeleton className="w-24 h-8 rounded-full" />
          <Skeleton className="w-28 h-8 rounded-full" />
        </div>
      </SkeletonCard>

      {/* SP Card List */}
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonCard key={i} className="p-5 border-l-4 border-l-slate-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5">
                <SkeletonBadge className="w-24 h-6" />
                <SkeletonBadge className="w-20 h-6" />
              </div>
              <Skeleton className="w-36 h-4" />
            </div>
            <Skeleton className="w-3/4 h-5 mb-2" />
            <SkeletonText lines={2} className="mb-4" />
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <Skeleton className="w-32 h-4" />
              <SkeletonButton className="w-28 h-8" />
            </div>
          </SkeletonCard>
        ))}
      </div>
    </div>
  );
}

/**
 * 9. History Skeleton
 * Mimics: Header -> 2 Summary Stat Cards -> Timeline Activity List
 */
export function HistorySkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="w-48 h-6" />
          <Skeleton className="w-72 h-4" />
        </div>
        <Skeleton className="w-56 h-10 rounded-xl" />
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SkeletonCard className="p-4 flex items-center gap-4">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <div className="space-y-1.5">
            <Skeleton className="w-28 h-3.5" />
            <Skeleton className="w-16 h-6" />
          </div>
        </SkeletonCard>
        <SkeletonCard className="p-4 flex items-center gap-4">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <div className="space-y-1.5">
            <Skeleton className="w-28 h-3.5" />
            <Skeleton className="w-16 h-6" />
          </div>
        </SkeletonCard>
      </div>

      {/* Timeline Card */}
      <SkeletonCard className="p-6">
        <div className="flex items-center justify-between mb-5">
          <Skeleton className="w-40 h-5" />
          <Skeleton className="w-20 h-7 rounded-lg" />
        </div>
        <div className="space-y-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="w-9 h-9 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="w-48 h-4" />
                  <Skeleton className="w-20 h-3" />
                </div>
                <Skeleton className="w-full h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </SkeletonCard>
    </div>
  );
}

/**
 * 10. Generic Page Skeleton
 * Versatile fallback for any other view or modal
 */
export function GenericPageSkeleton() {
  return (
    <div className="space-y-6">
      <SkeletonCard className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-2">
            <Skeleton className="w-52 h-6" />
            <Skeleton className="w-80 h-4" />
          </div>
          <SkeletonButton className="w-28 h-10" />
        </div>
      </SkeletonCard>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} className="p-5 space-y-3">
            <Skeleton className="w-full h-32 rounded-xl" />
            <Skeleton className="w-3/4 h-5" />
            <SkeletonText lines={2} />
          </SkeletonCard>
        ))}
      </div>
    </div>
  );
}
