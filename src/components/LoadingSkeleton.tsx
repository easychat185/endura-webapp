"use client";

export function SkeletonCard({ height = "h-32" }: { height?: string }) {
  return (
    <div
      className={`glass ${height} animate-pulse`}
      style={{ opacity: 0.4 }}
    />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-5">
      <SkeletonCard height="h-28" />
      <SkeletonCard height="h-36" />
      <SkeletonCard height="h-40" />
      <div className="grid grid-cols-2 gap-4">
        <SkeletonCard height="h-28" />
        <SkeletonCard height="h-28" />
      </div>
    </div>
  );
}

export function ProgressSkeleton() {
  return (
    <div className="space-y-5">
      <SkeletonCard height="h-24" />
      <SkeletonCard height="h-64" />
      <SkeletonCard height="h-64" />
      <SkeletonCard height="h-48" />
    </div>
  );
}
