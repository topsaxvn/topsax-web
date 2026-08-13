import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import {
  revalidateBrandPaths,
  revalidateCategoryPaths,
  revalidatePostPaths,
  revalidateProductPaths,
} from "@/lib/revalidate";

// Từ khi admin chuyển sang ghi thẳng Supabase từ client (không qua Server
// Action), revalidatePath() không còn được gọi tự động sau mỗi lần ghi - API
// route này là cầu nối để admin-api (client) vẫn có thể yêu cầu làm mới ISR
// cache của site public. Nhận {resource, slug?} thay vì path trực tiếp từ
// client, để không ai có thể revalidate tuỳ ý path ngoài ý muốn.
const bodySchema = z.discriminatedUnion("resource", [
  z.object({ resource: z.literal("product"), slug: z.string().optional() }),
  z.object({ resource: z.literal("category") }),
  z.object({ resource: z.literal("brand") }),
  z.object({ resource: z.literal("post"), slug: z.string().optional() }),
]);

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const json: unknown = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "invalid payload" }, { status: 400 });

  switch (parsed.data.resource) {
    case "product":
      revalidateProductPaths(parsed.data.slug);
      break;
    case "category":
      revalidateCategoryPaths();
      break;
    case "brand":
      revalidateBrandPaths();
      break;
    case "post":
      revalidatePostPaths(parsed.data.slug);
      break;
  }

  return NextResponse.json({ ok: true });
}
