import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/Skeleton";

// Dùng cho loading.tsx của /saxophone/[slug] và /phu-kien/[slug] - route này
// khớp cả trang danh mục (lưới sản phẩm) lẫn trang chi tiết 1 sản phẩm, nên
// khung skeleton kết hợp cả 2 dạng (ảnh lớn bên trái, danh sách bên phải)
// để không bị lệch bố cục dù rơi vào trường hợp nào.
export function ProductOrCategoryLoading() {
  return (
    <Container className="py-12">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-3 h-8 w-64" />

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <Skeleton className="aspect-square w-full rounded-2xl" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>

      <div className="mt-16 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
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
