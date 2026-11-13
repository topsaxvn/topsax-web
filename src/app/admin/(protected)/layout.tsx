import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Middleware đã xác thực bằng getUser() (có gọi mạng tới Supabase Auth) và
  // chặn /admin/* khi chưa đăng nhập. Ở đây chỉ đọc lại session từ cookie
  // (không gọi mạng) để lấy email hiển thị - đánh đổi lấy tốc độ, chấp nhận
  // được với dự án cá nhân quy mô nhỏ. Không dùng cho hành động ghi dữ liệu
  // nhạy cảm; các Server Action vẫn tự kiểm tra qua Supabase RLS.
  if (!session) {
    redirect("/admin/login");
  }

  // Từ khi có khóa học, học viên cũng có tài khoản: đã đăng nhập chưa chắc là
  // admin. Dữ liệu vẫn do RLS (public.is_admin()) bảo vệ; đây chỉ để học viên
  // không thấy giao diện quản trị. Hàm is_admin chưa có (file SQL khóa học
  // chưa chạy) thì giữ cách cũ: mọi tài khoản là admin.
  const { data: isAdmin, error } = await supabase.rpc("is_admin");
  const missingFunction = error?.code === "PGRST202";
  if (!isAdmin && !missingFunction) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper-soft px-4">
        <div className="w-full max-w-sm rounded-2xl border border-border bg-paper p-8 text-center">
          <h1 className="text-lg font-semibold text-ink">Không có quyền quản trị</h1>
          <p className="mt-2 text-sm text-muted">
            Tài khoản {session.user.email} là tài khoản học viên.
          </p>
          <Link href="/khoa-hoc" className="mt-5 inline-block rounded-full bg-ink px-5 py-2.5 text-sm text-paper">
            Về trang khóa học
          </Link>
        </div>
      </div>
    );
  }

  return <AdminShell userEmail={session.user.email ?? ""}>{children}</AdminShell>;
}
