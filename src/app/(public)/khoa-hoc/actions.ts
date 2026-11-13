"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { COURSE_LOGIN_PATH } from "@/lib/course";

/** Lỗi khi tạo đơn -> mã ngắn trên URL (không đưa nguyên văn thông báo lên URL). */
function errorKey(message: string): string {
  if (/đã có khóa học/i.test(message)) return "da-co";
  if (/chưa có giá/i.test(message)) return "chua-gia";
  if (/chưa mở bán/i.test(message)) return "chua-ban";
  return "loi";
}

/** Nút "Mua khóa học": tạo đơn (hoặc lấy lại đơn đang chờ) rồi sang trang thanh toán. */
export async function buyCourse(slug: string): Promise<void> {
  const back = `/khoa-hoc/${encodeURIComponent(slug)}`;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`${COURSE_LOGIN_PATH}?next=${encodeURIComponent(back)}`);

  const { data: course } = await supabase.from("courses").select("id").eq("slug", slug).maybeSingle();
  if (!course) redirect("/khoa-hoc");

  const { error } = await supabase.rpc("create_course_order", { p_course: course.id });
  if (error) redirect(`${back}?loi=${errorKey(error.message)}`);
  redirect(`${back}/thanh-toan`);
}
