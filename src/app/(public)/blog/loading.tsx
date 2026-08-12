import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <Container className="py-12">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="mt-3 h-8 w-24" />
      <Skeleton className="mt-3 h-5 w-full max-w-2xl" />

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i}>
            <Skeleton className="aspect-video w-full rounded-2xl" />
            <Skeleton className="mt-3 h-4 w-1/3" />
            <Skeleton className="mt-2 h-4 w-3/4" />
            <Skeleton className="mt-2 h-4 w-full" />
          </div>
        ))}
      </div>
    </Container>
  );
}
