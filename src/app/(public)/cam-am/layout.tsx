import { Suspense, type ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/Skeleton";
import { FeaturedProductsSidebar } from "@/components/product/FeaturedProductsSidebar";
import { getProducts } from "@/data-access/products";

export const revalidate = 1800;

async function FeaturedProductsAside() {
  const featuredProducts = await getProducts({ featured: true, limit: 8 });
  if (featuredProducts.length === 0) return null;

  return <FeaturedProductsSidebar products={featuredProducts} />;
}

function FeaturedProductsAsideSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-paper p-4">
      <Skeleton className="h-3 w-28" />
      <Skeleton className="mt-3 aspect-square w-full rounded-xl" />
      <Skeleton className="mt-3 h-3 w-16" />
      <Skeleton className="mt-2 h-4 w-3/4" />
      <Skeleton className="mt-2 h-4 w-1/2" />
    </div>
  );
}

// Layout riêng cho toàn bộ /cam-am: fetch sản phẩm nổi bật độc lập trong
// Suspense của chính nó, không chặn nội dung Cảm âm (đã có loading.tsx
// riêng của từng trang con) khi sidebar còn đang tải.
export default function CamAmLayout({ children }: { children: ReactNode }) {
  return (
    <Container className="py-12">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div className="min-w-0">{children}</div>
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <Suspense fallback={<FeaturedProductsAsideSkeleton />}>
              <FeaturedProductsAside />
            </Suspense>
          </div>
        </aside>
      </div>
    </Container>
  );
}
