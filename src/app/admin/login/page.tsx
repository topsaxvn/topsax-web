import type { Metadata } from "next";
import Image from "next/image";
import { LoginForm } from "@/components/forms/LoginForm";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Đăng nhập quản trị",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-paper-soft px-4 py-12">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-paper p-8 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <Image src="/brand/topsax-icon.png" alt={siteConfig.name} width={56} height={48} className="invert" />
          <h1 className="mt-4 text-lg font-semibold text-ink">Đăng nhập quản trị</h1>
          <p className="mt-1 text-sm text-muted">{siteConfig.name} Admin</p>
        </div>

        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
