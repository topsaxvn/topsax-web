import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

// Next.js 16 đổi tên quy ước file này thành "proxy.ts", nhưng vẫn giữ
// "middleware.ts" hoạt động (chỉ deprecated). Dùng tên cũ vì
// @netlify/plugin-nextjs (bản mới nhất khi viết) chưa bundle đúng
// Edge Function khi dùng "proxy.ts" - lỗi "Cannot find module
// './webpack-runtime.js'" khi build trên Netlify. Đổi lại "proxy.ts" khi
// plugin cập nhật hỗ trợ.
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );

  // getSession() chỉ đọc/giải mã cookie tại chỗ (không gọi mạng tới Supabase
  // Auth như getUser()) - đánh đổi lấy tốc độ cho mọi request vào /admin/*,
  // cùng lý do đã chấp nhận ở admin/(protected)/layout.tsx. Đây chỉ là cổng
  // điều hướng UX; an toàn dữ liệu thực sự nằm ở RLS của Supabase, không phải
  // ở middleware này.
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/admin/login";
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute && !isLoginPage && !session) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  if (isLoginPage && session) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
