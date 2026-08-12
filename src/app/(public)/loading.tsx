import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/Skeleton";

// Loading cho trang chủ - trang duy nhất nằm trực tiếp trong nhóm (public),
// nên loading.tsx ở đây chỉ áp dụng cho route "/". Các route con (blog,
// saxophone, phu-kien, ...) có loading.tsx riêng khớp bố cục của chúng.
export default function Loading() {
  return (
    <>
      <section className="border-b border-border bg-paper">
        <Container className="grid gap-12 py-16 lg:grid-cols-2 lg:items-center lg:py-20">
          <div>
            <Skeleton className="h-4 w-40" />
            <Skeleton className="mt-4 h-10 w-full max-w-md" />
            <Skeleton className="mt-3 h-10 w-3/4" />
            <Skeleton className="mt-5 h-5 w-full max-w-lg" />
            <div className="mt-8 flex flex-wrap gap-3">
              <Skeleton className="h-11 w-40 rounded-full" />
              <Skeleton className="h-11 w-40 rounded-full" />
            </div>
          </div>
          <Skeleton className="aspect-square w-full rounded-3xl" />
        </Container>
      </section>

      <section className="border-b border-border py-10">
        <Container>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-2xl" />
            ))}
          </div>
        </Container>
      </section>

      {Array.from({ length: 3 }).map((_, section) => (
        <section key={section} className="py-16">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="mt-2 h-7 w-52" />
              </div>
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i}>
                  <Skeleton className="aspect-square w-full rounded-2xl" />
                  <Skeleton className="mt-3 h-4 w-3/4" />
                  <Skeleton className="mt-2 h-4 w-1/2" />
                </div>
              ))}
            </div>
          </Container>
        </section>
      ))}
    </>
  );
}
