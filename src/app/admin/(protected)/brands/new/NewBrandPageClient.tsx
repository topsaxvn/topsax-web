"use client";

import { BrandForm } from "@/components/admin/BrandForm";

export function NewBrandPageClient() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-ink">Thêm thương hiệu</h1>
      <div className="mt-6">
        <BrandForm submitLabel="Tạo thương hiệu" />
      </div>
    </div>
  );
}
