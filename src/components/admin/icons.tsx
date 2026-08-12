import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  width: 20,
  height: 20,
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function DashboardIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1.5" />
      <rect x="13" y="3.5" width="7.5" height="4.5" rx="1.5" />
      <rect x="13" y="10.5" width="7.5" height="10" rx="1.5" />
      <rect x="3.5" y="13.5" width="7.5" height="7" rx="1.5" />
    </svg>
  );
}

export function ProductIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3.5 8l8.5-4.5L20.5 8v8L12 20.5 3.5 16z" />
      <path d="M3.5 8L12 12.5 20.5 8" />
      <path d="M12 12.5V20.5" />
    </svg>
  );
}

export function CategoryIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 5.5A1.5 1.5 0 015.5 4h4l2 2.5h8A1.5 1.5 0 0121 8v10.5A1.5 1.5 0 0119.5 20h-14A1.5 1.5 0 014 18.5z" />
    </svg>
  );
}

export function BrandIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 3.5h12a1 1 0 011 1V21l-7-4-7 4V4.5a1 1 0 011-1z" />
    </svg>
  );
}

export function BlogIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="4" y="3.5" width="16" height="17" rx="1.5" />
      <path d="M7.5 8h9M7.5 12h9M7.5 16h5.5" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function LogoutIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M9 3.5H6.5A1.5 1.5 0 005 5v14a1.5 1.5 0 001.5 1.5H9" />
      <path d="M16 16l4-4-4-4" />
      <path d="M20 12H9" />
    </svg>
  );
}
