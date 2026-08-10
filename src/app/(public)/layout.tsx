import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileContactBar } from "@/components/layout/MobileContactBar";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-col pb-14 lg:pb-0">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <MobileContactBar />
    </div>
  );
}
