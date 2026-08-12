import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/Skeleton";

// Dùng cho loading.tsx của /saxophone và /phu-kien (trang danh mục dạng lưới),
// khớp bố cục: SectionHeading + CategoryFilterBar + ProductGrid.
export function CategoryListingLoading() {
  return (
    <Container className="py-12">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="mt-3 h-8 w-56" />
      <Skeleton className="mt-3 h-5 w-full max-w-2xl" />

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-20 rounded-full" />
          ))}
        </div>
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-24 rounded-full" />
          ))}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i}>
            <Skeleton className="aspect-square w-full rounded-2xl" />
            <Skeleton className="mt-3 h-4 w-3/4" />
            <Skeleton className="mt-2 h-4 w-1/2" />
          </div>
        ))}
      </div>
    </Container>
  );
}
