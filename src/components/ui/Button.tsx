import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

const variantClasses = {
  primary: "bg-ink text-paper hover:bg-ink-soft",
  brass: "bg-brass text-ink hover:bg-brass-soft",
  outline: "border border-ink text-ink hover:bg-ink hover:text-paper",
  ghost: "text-ink hover:bg-paper-soft",
} as const;

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors";

type Variant = keyof typeof variantClasses;

type LinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: Variant;
};

type NativeButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: undefined;
  variant?: Variant;
};

export function Button(props: LinkButtonProps | NativeButtonProps) {
  const { variant = "primary", className, ...rest } = props;
  const classes = cn(baseClasses, variantClasses[variant], className);

  if ("href" in rest && rest.href) {
    const { href, ...anchorProps } = rest as LinkButtonProps;
    const isExternal = /^https?:\/\//.test(href);
    return (
      <Link
        href={href}
        className={classes}
        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...anchorProps}
      />
    );
  }

  return <button className={classes} {...(rest as NativeButtonProps)} />;
}
