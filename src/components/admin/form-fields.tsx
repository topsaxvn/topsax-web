import type { ReactNode } from "react";

export const inputClass =
  "mt-1.5 w-full rounded-lg border border-border bg-paper px-3.5 py-2.5 text-sm text-ink outline-none focus:border-brass";

export function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-paper p-6">
      <h2 className="text-sm font-semibold text-ink">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </div>
  );
}

export function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-ink">{label}</span>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </label>
  );
}
