import { Skeleton } from "#/shared/components/ui/skeleton";

export function FetchingSkeletonBar({ show }: { show: boolean }) {
  return (
    <div className="h-1 overflow-hidden" aria-hidden={!show}>
      {show ? <Skeleton className="h-1 w-full rounded-none" /> : null}
    </div>
  );
}

export function TablePageSkeleton({ rows = 8, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-6" role="status" aria-label="Loading table data">
      <PageHeadingSkeleton />
      <div className="overflow-hidden rounded-xl border bg-card shadow-xs">
        <div className="grid gap-3 border-b p-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={`toolbar-${index}`} className="h-9 w-full" />
          ))}
        </div>
        <div className="divide-y">
          {Array.from({ length: rows }, (_, rowIndex) => (
            <div
              key={`row-${rowIndex}`}
              className="grid items-center gap-4 px-4 py-4"
              style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
            >
              {Array.from({ length: columns }, (_, columnIndex) => (
                <Skeleton
                  key={`cell-${rowIndex}-${columnIndex}`}
                  className={columnIndex === 0 ? "h-10 w-full" : "h-4 w-full"}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between border-t p-4">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-8 w-52" />
        </div>
      </div>
      <span className="sr-only">Loading data…</span>
    </div>
  );
}

export function DetailPageSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-label="Loading details">
      <div className="rounded-xl border bg-card p-6 shadow-xs">
        <div className="flex items-center gap-5">
          <Skeleton className="size-20 rounded-2xl" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-64 max-w-full" />
            <Skeleton className="h-4 w-80 max-w-full" />
          </div>
          <Skeleton className="h-7 w-20 rounded-full" />
        </div>
        <div className="mt-6 grid gap-4 border-t pt-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={`meta-${index}`} className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-5 w-32 max-w-full" />
            </div>
          ))}
        </div>
      </div>
      <Skeleton className="h-40 w-full rounded-xl" />
      <span className="sr-only">Loading details…</span>
    </div>
  );
}

export function RelationPanelSkeleton() {
  return (
    <section
      className="rounded-xl border bg-card shadow-xs"
      role="status"
      aria-label="Loading related data"
    >
      <div className="flex items-center justify-between border-b p-5">
        <Skeleton className="h-6 w-28" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="grid gap-3 p-5">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={`relation-${index}`} className="space-y-2 rounded-lg border p-4">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
      <span className="sr-only">Loading related data…</span>
    </section>
  );
}

export function TagsPageSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-label="Loading tags">
      <PageHeadingSkeleton />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 9 }, (_, index) => (
          <div key={`tag-card-${index}`} className="space-y-3 rounded-xl border bg-card p-5">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
      <div className="rounded-xl border bg-card p-5">
        <Skeleton className="h-5 w-24" />
        <div className="mt-4 flex flex-wrap gap-2">
          {Array.from({ length: 12 }, (_, index) => (
            <Skeleton key={`tag-pill-${index}`} className="h-7 w-20 rounded-full" />
          ))}
        </div>
      </div>
      <span className="sr-only">Loading tags…</span>
    </div>
  );
}

export function PostDetailSkeleton() {
  return (
    <div
      className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]"
      role="status"
      aria-label="Loading post"
    >
      <article className="rounded-xl border bg-card p-6 shadow-xs">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-3 h-9 w-4/5" />
        <Skeleton className="mt-3 h-4 w-2/3" />
        <div className="mt-4 flex gap-2">
          <Skeleton className="h-7 w-16 rounded-full" />
          <Skeleton className="h-7 w-20 rounded-full" />
        </div>
        <div className="mt-8 space-y-3">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={`post-line-${index}`} className="h-4 w-full" />
          ))}
        </div>
      </article>
      <aside className="rounded-xl border bg-card shadow-xs">
        <div className="border-b p-5">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="mt-2 h-4 w-20" />
        </div>
        <div className="divide-y">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={`comment-${index}`} className="space-y-3 p-5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          ))}
        </div>
      </aside>
      <span className="sr-only">Loading post…</span>
    </div>
  );
}

export function DashboardPageSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-label="Loading dashboard">
      <PageHeadingSkeleton />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={`metric-${index}`}
            className="space-y-4 rounded-xl border bg-card p-5 shadow-xs"
          >
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.3fr_.7fr]">
        <Skeleton className="h-80 w-full rounded-xl" />
        <Skeleton className="h-80 w-full rounded-xl" />
      </div>
      <span className="sr-only">Loading dashboard…</span>
    </div>
  );
}

function PageHeadingSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-9 w-72 max-w-full" />
      <Skeleton className="h-4 w-[32rem] max-w-full" />
    </div>
  );
}
