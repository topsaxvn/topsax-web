"use client";

import type { ReactNode } from "react";

export function ConfirmButton({
  confirmMessage,
  children,
  className,
}: {
  confirmMessage: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(e) => {
        if (!confirm(confirmMessage)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
