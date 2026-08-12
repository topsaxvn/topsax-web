import { Skeleton } from "@/components/ui/Skeleton";

export default function AdminLoading() {
  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-9 w-28 rounded-full" />
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-paper">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-b border-border p-4 last:border-b-0">
            <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="ml-auto h-4 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}
