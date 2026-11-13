"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton({ email }: { email: string }) {
  const router = useRouter();
  return (
    <span>
      {email} ·{" "}
      <button
        type="button"
        className="underline hover:text-ink"
        onClick={async () => {
          await createClient().auth.signOut();
          router.refresh();
        }}
      >
        Đăng xuất
      </button>
    </span>
  );
}
