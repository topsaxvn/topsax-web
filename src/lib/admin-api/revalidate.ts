export type RevalidatePayload =
  | { resource: "product"; slug?: string }
  | { resource: "category" }
  | { resource: "brand" }
  | { resource: "post"; slug?: string };

// Fire-and-forget: không chặn UI admin và không hiện lỗi cho người dùng nếu
// thất bại - nguồn sự thật của admin là Supabase (tự fetch lại danh sách của
// chính nó), endpoint này chỉ phục vụ site public vốn đã có ISR fallback
// (revalidate = 1800s) nếu lần gọi này thất bại.
export function triggerRevalidate(payload: RevalidatePayload) {
  fetch("/api/admin/revalidate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch((e: unknown) => {
    console.error("[admin] revalidate failed", payload, e);
  });
}
