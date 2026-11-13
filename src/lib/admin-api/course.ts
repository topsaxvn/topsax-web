import { createClient } from "@/lib/supabase/client";
import type { CourseItemKind, Database, Json } from "@/types/database";
import { compareItems, type ParsedGuide, type ParsedItemFile } from "@/lib/course";

const supabase = createClient();

type Tables = Database["public"]["Tables"];

export type CourseAdmin = Tables["courses"]["Row"];
export type ItemAdmin = Tables["course_items"]["Row"] & {
  file_name: string | null;
  video_url: string;
  content_updated_at: string | null;
};
export type DayAdmin = Tables["course_lessons"]["Row"] & {
  items: ItemAdmin[];
  /** null: ngày này chưa có bài giảng */
  guide: string | null;
};
export type StudentAdmin = Database["public"]["Functions"]["admin_course_students"]["Returns"][number];

function check<T extends { error: { message: string } | null }>(res: T): T {
  if (res.error) throw new Error(res.error.message);
  return res;
}

// Mọi lệnh ghi ở đây dựa vào RLS: chỉ tài khoản trong admin_users mới ghi được
// (supabase/migrations/20261110000000_admin_role_and_course.sql và 20261111000000_course_day_items.sql).
export const courseApi = {
  async getCourse(slug: string): Promise<CourseAdmin | null> {
    return check(await supabase.from("courses").select("*").eq("slug", slug).maybeSingle()).data;
  },

  async updateCourse(id: string, patch: Tables["courses"]["Update"]): Promise<void> {
    check(await supabase.from("courses").update(patch).eq("id", id));
  },

  async listDays(courseId: string): Promise<DayAdmin[]> {
    const lessons = check(await supabase.from("course_lessons").select("*").eq("course_id", courseId).order("day")).data ?? [];
    const lessonIds = lessons.map((l) => l.id);
    if (!lessonIds.length) return [];
    const [items, guides] = await Promise.all([
      supabase.from("course_items").select("*").in("lesson_id", lessonIds),
      supabase.from("course_lesson_guides").select("lesson_id,guide").in("lesson_id", lessonIds),
    ]);
    const itemRows = check(items).data ?? [];
    // (không lấy cột score: nặng, trang này không cần)
    const content = itemRows.length
      ? (check(
          await supabase
            .from("course_item_content")
            .select("item_id,file_name,video_url,updated_at")
            .in(
              "item_id",
              itemRows.map((i) => i.id),
            ),
        ).data ?? [])
      : [];
    const contentBy = new Map(content.map((c) => [c.item_id, c]));
    const guideBy = new Map((check(guides).data ?? []).map((g) => [g.lesson_id, g.guide]));
    return lessons.map((l) => ({
      ...l,
      guide: guideBy.get(l.id) ?? null,
      items: itemRows
        .filter((i) => i.lesson_id === l.id)
        .map((i) => {
          const c = contentBy.get(i.id);
          return { ...i, file_name: c?.file_name ?? null, video_url: c?.video_url ?? "", content_updated_at: c?.updated_at ?? null };
        })
        .sort(compareItems),
    }));
  },

  /** id của ngày; tạo ngày (chưa đăng) nếu chưa có. Có `title` thì đặt luôn tên ngày. */
  async ensureDay(courseId: string, day: number, title?: string): Promise<string> {
    const found = check(
      await supabase.from("course_lessons").select("id,title").eq("course_id", courseId).eq("day", day).maybeSingle(),
    ).data;
    if (found) {
      if (title !== undefined && title !== found.title) check(await supabase.from("course_lessons").update({ title }).eq("id", found.id));
      return found.id;
    }
    return check(
      await supabase
        .from("course_lessons")
        .insert({ course_id: courseId, day, title: title ?? "" })
        .select("id")
        .single(),
    ).data!.id;
  },

  /** Tạo hoặc thay một bài trong ngày (cùng ngày + loại + tên thì thay). Link video đã nhập được giữ lại. */
  async saveItemFile(lessonId: string, f: ParsedItemFile, position: number): Promise<string> {
    const item = check(
      await supabase
        .from("course_items")
        .upsert({ lesson_id: lessonId, kind: f.kind, title: f.title, subtitle: f.subtitle, position }, { onConflict: "lesson_id,kind,title" })
        .select("id")
        .single(),
    ).data!;
    check(await supabase.from("course_item_content").upsert({ item_id: item.id, score: f.score as Json, file_name: f.fileName }));
    return item.id;
  },

  async saveGuide(lessonId: string, guide: string): Promise<void> {
    check(await supabase.from("course_lesson_guides").upsert({ lesson_id: lessonId, guide }));
  },

  /** Xóa các bài cùng loại trong ngày, trừ những bài vừa tải lên. */
  async removeItemsExcept(lessonId: string, kind: CourseItemKind, keep: string[]): Promise<number> {
    let q = supabase.from("course_items").delete().eq("lesson_id", lessonId).eq("kind", kind);
    if (keep.length) q = q.not("id", "in", `(${keep.join(",")})`);
    return (check(await q.select("id")).data ?? []).length;
  },

  async updateLesson(id: string, patch: Tables["course_lessons"]["Update"]): Promise<void> {
    check(await supabase.from("course_lessons").update(patch).eq("id", id));
  },

  async removeLesson(id: string): Promise<void> {
    check(await supabase.from("course_lessons").delete().eq("id", id));
  },

  async setVideo(itemId: string, video_url: string): Promise<void> {
    check(await supabase.from("course_item_content").update({ video_url }).eq("item_id", itemId));
  },

  async removeItem(id: string): Promise<void> {
    check(await supabase.from("course_items").delete().eq("id", id));
  },

  async listStudents(courseId: string): Promise<StudentAdmin[]> {
    return check(await supabase.rpc("admin_course_students", { p_course: courseId })).data ?? [];
  },

  async grant(courseId: string, email: string, note: string): Promise<void> {
    check(await supabase.rpc("admin_grant_course", { p_course: courseId, p_email: email, p_note: note }));
  },

  async revoke(courseId: string, userId: string): Promise<void> {
    check(await supabase.from("course_enrollments").delete().eq("course_id", courseId).eq("user_id", userId));
  },

  // --- thanh toán (supabase/migrations/20261112000000_course_orders.sql)
  async listOrders(courseId: string): Promise<OrderAdmin[]> {
    return check(await supabase.rpc("admin_course_orders", { p_course: courseId })).data ?? [];
  },

  async confirmOrder(orderId: string): Promise<void> {
    check(await supabase.rpc("admin_confirm_order", { p_order: orderId }));
  },

  async cancelOrder(orderId: string): Promise<void> {
    check(await supabase.from("course_orders").update({ status: "cancelled" }).eq("id", orderId).eq("status", "pending"));
  },

  async listPayments(limit = 30): Promise<PaymentAdmin[]> {
    return (
      check(await supabase.from("bank_payments").select("*").order("received_at", { ascending: false }).limit(limit)).data ?? []
    );
  },

  async bankSecretCreatedAt(): Promise<string | null> {
    return check(await supabase.rpc("admin_bank_secret_created_at")).data ?? null;
  },

  /** Khóa mới cho điện thoại; khóa cũ hết hiệu lực ngay. */
  async rotateBankSecret(): Promise<string> {
    return check(await supabase.rpc("admin_rotate_bank_secret")).data!;
  },
};

export type OrderAdmin = Database["public"]["Functions"]["admin_course_orders"]["Returns"][number];
export type PaymentAdmin = Tables["bank_payments"]["Row"];

export type { ParsedGuide, ParsedItemFile };
