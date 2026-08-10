import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn(align === "center" && "text-center", className)}>
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brass">{eyebrow}</p>
      )}
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{title}</h2>
      {description && <p className="mt-3 max-w-2xl text-muted">{description}</p>}
    </div>
  );
}
