import { createClient } from "@/lib/supabase/server";
import { compareItems } from "@/lib/course";
import type { CourseItemKind, Database } from "@/types/database";

type CourseRow = Database["public"]["Tables"]["courses"]["Row"];
type LessonRow = Database["public"]["Tables"]["course_lessons"]["Row"];

export interface CourseItemView {
  kind: CourseItemKind;
  title: string;
}

export interface CourseLessonView extends Pick<LessonRow, "id" | "day" | "title" | "is_free"> {
  items: CourseItemView[];
  /** Ngày đã xong (mọi bài luyện nốt, bài hát đều có kết quả): số sao thấp nhất. Chưa xong: null. */
  stars: number | null;
}

export type CourseOrderRow = Database["public"]["Tables"]["course_orders"]["Row"];

export interface CourseView {
  course: CourseRow;
  lessons: CourseLessonView[];
  user: { id: string; email: string } | null;
  isAdmin: boolean;
  enrolled: boolean;
  /** Đơn đang chờ chuyển khoản của người đang xem (nếu có). */
  pendingOrder: CourseOrderRow | null;
}

export interface CourseCard {
  course: CourseRow;
  lessonCount: number;
  owned: boolean;
}

/** Các khóa học người đang xem thấy được: đang bán, hoặc nháp mà người này có quyền (RLS lọc). */
export async function getCourseList(): Promise<{ courses: CourseCard[]; user: { email: string } | null }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: courses, error } = await supabase.from("courses").select("*").order("created_at");
  if (error?.code === "PGRST205") return { courses: [], user: null };
  if (error) throw error;
  if (!courses.length) return { courses: [], user: user ? { email: user.email ?? "" } : null };

  const ids = courses.map((c) => c.id);
  const [lessons, enrollments, admin] = await Promise.all([
    supabase.from("course_lessons").select("course_id").in("course_id", ids).eq("is_published", true),
    user
      ? supabase.from("course_enrollments").select("course_id").eq("user_id", user.id).in("course_id", ids)
      : Promise.resolve({ data: [] as { course_id: string }[], error: null }),
    user ? supabase.rpc("is_admin") : Promise.resolve({ data: false, error: null }),
  ]);
  const owned = new Set((enrollments.data ?? []).map((e) => e.course_id));
  return {
    courses: courses.map((c) => ({
      course: c,
      lessonCount: (lessons.data ?? []).filter((l) => l.course_id === c.id).length,
      owned: Boolean(admin.data) || owned.has(c.id),
    })),
    user: user ? { email: user.email ?? "" } : null,
  };
}

/** Đơn mới nhất (đang chờ hoặc đã trả) của người đang xem cho một khóa học. */
export async function getMyLatestOrder(courseId: string): Promise<CourseOrderRow | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("course_orders")
    .select("*")
    .eq("course_id", courseId)
    .eq("user_id", user.id)
    .neq("status", "cancelled")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data;
}

// Trang khóa học phụ thuộc người đang xem (đã mua chưa, tiến độ), nên đọc
// bằng client có cookie và không cache. RLS quyết định ai thấy gì: khóa học
// còn "draft" thì chỉ admin và học viên đã được mở khóa mới thấy.
export async function getCourseView(slug: string): Promise<CourseView | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: course, error } = await supabase.from("courses").select("*").eq("slug", slug).maybeSingle();
  // PGRST205: bảng chưa có (file SQL khóa học chưa chạy trên project này)
  if (error?.code === "PGRST205") return null;
  if (error) throw error;
  if (!course) return null;

  const [lessonsRes, adminRes, enrollRes, orderRes] = await Promise.all([
    supabase
      .from("course_lessons")
      .select("id,day,title,is_free")
      .eq("course_id", course.id)
      .eq("is_published", true)
      .order("day"),
    user ? supabase.rpc("is_admin") : Promise.resolve({ data: false, error: null }),
    user
      ? supabase.from("course_enrollments").select("course_id").eq("course_id", course.id).eq("user_id", user.id).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    user
      ? supabase
          .from("course_orders")
          .select("*")
          .eq("course_id", course.id)
          .eq("user_id", user.id)
          .eq("status", "pending")
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ]);
  if (lessonsRes.error) throw lessonsRes.error;
  const lessons = lessonsRes.data;

  const itemsRes = lessons.length
    ? await supabase
        .from("course_items")
        .select("id,lesson_id,kind,title,position")
        .in(
          "lesson_id",
          lessons.map((l) => l.id),
        )
    : { data: [], error: null };
  // (file SQL "mỗi ngày nhiều bài" chưa chạy: vẫn hiện được danh sách ngày)
  const items = itemsRes.error ? [] : itemsRes.data;

  const stars = new Map<string, number>();
  if (user && items.length) {
    const { data: progress } = await supabase
      .from("course_item_progress")
      .select("item_id,stars")
      .in(
        "item_id",
        items.map((i) => i.id),
      );
    for (const p of progress ?? []) stars.set(p.item_id, p.stars);
  }

  return {
    course,
    lessons: lessons.map((l) => {
      const mine = items.filter((i) => i.lesson_id === l.id).sort(compareItems);
      const required = mine.filter((i) => i.kind !== "bonus");
      const done = required.length > 0 && required.every((i) => stars.has(i.id));
      return {
        ...l,
        items: mine.map((i) => ({ kind: i.kind, title: i.title })),
        stars: done ? Math.min(...required.map((i) => stars.get(i.id)!)) : null,
      };
    }),
    user: user ? { id: user.id, email: user.email ?? "" } : null,
    isAdmin: Boolean(adminRes.data),
    enrolled: Boolean(enrollRes.data),
    // (bảng đơn hàng chưa có khi file SQL thanh toán chưa chạy: coi như không có đơn)
    pendingOrder: orderRes.error ? null : orderRes.data,
  };
}
