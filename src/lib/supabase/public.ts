import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// Client đọc dữ liệu công khai (sản phẩm, bài viết, danh mục) cho các trang
// public. Không dùng cookies()/next-headers như src/lib/supabase/server.ts
// nên không ép route thành force-dynamic - cho phép Next.js cache/ISR các
// trang này thay vì render lại (gọi Supabase lại) trên mỗi request.
export function createPublicClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  );
}
