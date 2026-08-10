import type { Metadata } from "next";
import { BrandForm } from "@/components/admin/BrandForm";
import { createBrand } from "@/app/admin/(protected)/brands/actions";

export const metadata: Metadata = { title: "Thêm thương hiệu", robots: { index: false, follow: false } };

export default function NewBrandPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-ink">Thêm thương hiệu</h1>
      <div className="mt-6">
        <BrandForm action={createBrand} submitLabel="Tạo thương hiệu" />
      </div>
    </div>
  );
}
