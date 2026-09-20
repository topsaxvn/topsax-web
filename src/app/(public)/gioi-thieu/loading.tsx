import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <Container className="py-12">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="mt-3 h-8 w-56" />
      <Skeleton className="mt-3 h-5 w-full max-w-2xl" />

      <div className="mt-8 max-w-3xl space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border bg-paper-soft p-6">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="mt-3 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-2/3" />
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-wrap gap-3">
        <Skeleton className="h-11 w-36 rounded-full" />
        <Skeleton className="h-11 w-44 rounded-full" />
      </div>

      <div className="mt-16 border-t border-border pt-12">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="mt-3 h-8 w-72" />
        <Skeleton className="mt-3 h-5 w-full max-w-2xl" />

        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-3">
              <Skeleton className="h-11 w-40 rounded-full" />
              <Skeleton className="h-11 w-32 rounded-full" />
              <Skeleton className="h-11 w-32 rounded-full" />
            </div>
            <div className="space-y-3 rounded-2xl border border-border bg-paper-soft p-6">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-paper p-6">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="mt-2 h-4 w-3/4" />
            <div className="mt-5 space-y-3">
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-11 w-32 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
