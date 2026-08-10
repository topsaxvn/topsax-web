"use client";

import { useActionState } from "react";
import {
  submitContactMessage,
  type ContactFormState,
} from "@/app/(public)/lien-he/actions";

const initialState: ContactFormState = { status: "idle", message: "" };

export function ContactForm() {
  const [state, formAction, pending] = useActionState(
    submitContactMessage,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="name" className="text-sm font-medium text-ink">
          Họ tên
        </label>
        <input
          id="name"
          name="name"
          required
          className="mt-1.5 w-full rounded-lg border border-border bg-paper px-3.5 py-2.5 text-sm text-ink outline-none focus:border-brass"
        />
        {state.fieldErrors?.name && (
          <p className="mt-1 text-xs text-red-600">{state.fieldErrors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="text-sm font-medium text-ink">
          Số điện thoại
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          className="mt-1.5 w-full rounded-lg border border-border bg-paper px-3.5 py-2.5 text-sm text-ink outline-none focus:border-brass"
        />
        {state.fieldErrors?.phone && (
          <p className="mt-1 text-xs text-red-600">{state.fieldErrors.phone}</p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="text-sm font-medium text-ink">
          Nội dung cần tư vấn
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          className="mt-1.5 w-full rounded-lg border border-border bg-paper px-3.5 py-2.5 text-sm text-ink outline-none focus:border-brass"
        />
        {state.fieldErrors?.message && (
          <p className="mt-1 text-xs text-red-600">{state.fieldErrors.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-ink-soft disabled:opacity-60"
      >
        {pending ? "Đang gửi..." : "Gửi liên hệ"}
      </button>

      {state.status !== "idle" && (
        <p
          aria-live="polite"
          className={
            state.status === "success" ? "text-sm text-green-700" : "text-sm text-red-600"
          }
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
