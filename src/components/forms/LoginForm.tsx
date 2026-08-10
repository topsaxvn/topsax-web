"use client";

import { useActionState } from "react";
import { signIn, type LoginFormState } from "@/app/admin/login/actions";

const initialState: LoginFormState = { status: "idle", message: "" };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(signIn, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="email" className="text-sm font-medium text-ink">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          className="mt-1.5 w-full rounded-lg border border-border bg-paper px-3.5 py-2.5 text-sm text-ink outline-none focus:border-brass"
        />
      </div>

      <div>
        <label htmlFor="password" className="text-sm font-medium text-ink">
          Mật khẩu
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mt-1.5 w-full rounded-lg border border-border bg-paper px-3.5 py-2.5 text-sm text-ink outline-none focus:border-brass"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-ink-soft disabled:opacity-60"
      >
        {pending ? "Đang đăng nhập..." : "Đăng nhập"}
      </button>

      {state.status === "error" && (
        <p aria-live="polite" className="text-sm text-red-600">
          {state.message}
        </p>
      )}
    </form>
  );
}
