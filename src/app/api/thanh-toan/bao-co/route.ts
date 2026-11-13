import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { parseBankMessage } from "@/lib/payment";
import type { Database } from "@/types/database";

// Điện thoại Android (MacroDroid) gửi nội dung thông báo biến động số dư của
// app ngân hàng về đây:
//
//   POST /api/thanh-toan/bao-co
//   X-Topsax-Key: <khóa bí mật tạo ở /admin/khoa-hoc>
//   body: nội dung thông báo (text/plain), hoặc JSON {"text": "..."}
//
// Route chỉ đọc số tiền và mã đơn; việc kiểm khóa, tìm đơn và mở khóa học do
// hàm record_bank_payment trong Supabase làm (khóa chỉ lưu dạng băm ở đó), nên
// server không cần khóa service role.

export const dynamic = "force-dynamic";

const MAX_BODY = 4000;

async function readText(req: NextRequest): Promise<string> {
  const raw = (await req.text()).slice(0, MAX_BODY);
  if ((req.headers.get("content-type") ?? "").includes("json")) {
    try {
      const data = JSON.parse(raw) as { text?: unknown; title?: unknown };
      return [data.title, data.text].filter((x) => typeof x === "string" && x).join(" ");
    } catch {
      // MacroDroid đôi khi gửi JSON hỏng khi thông báo có dấu ngoặc kép: dùng nguyên văn
    }
  }
  return raw;
}

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-topsax-key") ?? req.nextUrl.searchParams.get("key") ?? "";
  if (!secret) return NextResponse.json({ error: "missing key" }, { status: 401 });

  const text = (await readText(req)).trim();
  const { amount, codes } = parseBankMessage(text);

  // Tin không liên quan (OTP, quảng cáo, tiền ra): không ghi lại
  if ((amount === null && codes.length === 0) || (amount !== null && amount <= 0)) {
    return NextResponse.json({ result: "ignored" });
  }

  const supabase = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await supabase.rpc("record_bank_payment", {
    p_secret: secret,
    p_raw: text,
    p_amount: amount,
    p_codes: codes,
  });
  if (error) {
    const forbidden = error.code === "42501";
    return NextResponse.json({ error: forbidden ? "wrong key" : error.message }, { status: forbidden ? 401 : 500 });
  }
  return NextResponse.json(data);
}

export function GET() {
  return NextResponse.json({ ok: true, hint: "POST nội dung thông báo ngân hàng kèm header X-Topsax-Key" });
}
