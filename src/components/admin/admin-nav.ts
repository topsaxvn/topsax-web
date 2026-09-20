import { BlogIcon, BrandIcon, CategoryIcon, DashboardIcon, MusicNoteIcon, ProductIcon } from "@/components/admin/icons";

export const adminNavItems = [
  { href: "/admin", label: "Dashboard", icon: DashboardIcon, exact: true },
  { href: "/admin/products", label: "Sản phẩm", icon: ProductIcon, exact: false },
  { href: "/admin/categories", label: "Danh mục", icon: CategoryIcon, exact: false },
  { href: "/admin/brands", label: "Thương hiệu", icon: BrandIcon, exact: false },
  { href: "/admin/blog", label: "Blog", icon: BlogIcon, exact: false },
  { href: "/admin/cam-am", label: "Cảm âm", icon: MusicNoteIcon, exact: false },
] as const;
