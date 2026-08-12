import { Button } from "@/components/ui/Button";

export default function AdminNotFound() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-paper px-6 py-16 text-center">
      <p className="text-sm font-semibold text-brass-deep">404</p>
      <h1 className="text-xl font-semibold text-ink">Không tìm thấy bản ghi này</h1>
      <p className="max-w-md text-sm text-muted">
        Sản phẩm, danh mục, thương hiệu hoặc bài viết này có thể đã bị xóa.
      </p>
      <Button href="/admin">Về Dashboard</Button>
    </div>
  );
}
