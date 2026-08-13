import type { PostgrestError } from "@supabase/supabase-js";

// Trước đây mỗi Server Action tự lặp lại đoạn map lỗi 23505 (unique
// violation) sang thông báo tiếng Việt - gom lại 1 chỗ dùng chung cho cả
// admin-api client-side lẫn phần server còn lại.
export function mapPgError(error: PostgrestError, uniqueMessage: string): string {
  return error.code === "23505" ? uniqueMessage : "Có lỗi xảy ra, vui lòng thử lại.";
}
