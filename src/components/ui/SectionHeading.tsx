import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  as: Heading = "h2",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  align?: "left" | "center";
  className?: string;
  /** "h1" khi đây là tiêu đề chính của trang (trang danh mục, blog, cảm âm...) - mỗi trang cần đúng 1 H1. */
  as?: "h1" | "h2";
}) {
  return (
    <div className={cn(align === "center" && "text-center", className)}>
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brass">{eyebrow}</p>
      )}
      <Heading className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{title}</Heading>
      {description && <p className="mt-3 max-w-2xl text-muted">{description}</p>}
    </div>
  );
}
