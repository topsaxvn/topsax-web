import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Link trong thư xác nhận đăng ký, và đăng nhập Google, quay về đây kèm
// ?code=... (luồng PKCE của @supabase/ssr): đổi code lấy phiên đăng nhập rồi
// chuyển tới trang cần đến.
// Địa chỉ này phải nằm trong Supabase > Authentication > URL Configuration >
// Redirect URLs (http://localhost:3000/** khi chạy local).
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const rawNext = searchParams.get("next") ?? "/khoa-hoc";
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/khoa-hoc";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }
  return NextResponse.redirect(`${origin}/khoa-hoc/dang-nhap?loi=1`);
}
