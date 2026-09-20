import { Suspense, type ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/Skeleton";
import { FeaturedProductsSidebar } from "@/components/product/FeaturedProductsSidebar";
import { FeaturedProductsMobileSheet } from "@/components/product/FeaturedProductsMobileSheet";
import { getProducts } from "@/data-access/products";

export const revalidate = 1800;

// Desktop: sidebar sticky. Mobile: popup ở đáy màn hình (position: fixed nên
// không bị ảnh hưởng bởi việc <aside> cha bị ẩn trên mobile).
async function FeaturedProducts() {
  const featuredProducts = await getProducts({ featured: true, limit: 8 });

  return (
    <>
      <aside className="hidden lg:block">
        <div className="sticky top-24">
          <FeaturedProductsSidebar products={featuredProducts} />
        </div>
      </aside>
      <FeaturedProductsMobileSheet products={featuredProducts} />
    </>
  );
}

function FeaturedProductsSkeleton() {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24 rounded-2xl border border-border bg-paper p-4">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="mt-3 aspect-square w-full rounded-xl" />
        <Skeleton className="mt-3 h-3 w-16" />
        <Skeleton className="mt-2 h-4 w-3/4" />
        <Skeleton className="mt-2 h-4 w-1/2" />
      </div>
    </aside>
  );
}

// Layout riêng cho toàn bộ /cam-am: fetch sản phẩm nổi bật độc lập trong
// Suspense của chính nó, không chặn nội dung Cảm âm (đã có loading.tsx
// riêng của từng trang con) khi sidebar còn đang tải. Desktop hiển thị danh
// sách dài trong sidebar sticky, mobile hiển thị popup có thể thu nhỏ ở đáy
// màn hình (thay cho thanh liên hệ, đã ẩn riêng ở trang này).
export default function CamAmLayout({ children }: { children: ReactNode }) {
  return (
    <Container className="py-12">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div className="min-w-0">{children}</div>
        <Suspense fallback={<FeaturedProductsSkeleton />}>
          <FeaturedProducts />
        </Suspense>
      </div>
    </Container>
  );
}
