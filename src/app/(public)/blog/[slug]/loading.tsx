import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <Container className="py-12">
      <article className="mx-auto max-w-3xl">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-3 h-9 w-full" />
        <Skeleton className="mt-2 h-9 w-2/3" />
        <Skeleton className="mt-3 h-4 w-32" />

        <div className="mt-8 space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      </article>
    </Container>
  );
}
