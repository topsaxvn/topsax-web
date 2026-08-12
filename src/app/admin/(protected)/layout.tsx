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

  return <AdminShell userEmail={session.user.email ?? ""}>{children}</AdminShell>;
}
