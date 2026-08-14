"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import { BrandForm } from "@/components/admin/BrandForm";
import { brandsApi } from "@/lib/admin-api/brands";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Brand } from "@/data-access/brands";

export function EditBrandPageClient() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [brands, setBrands] = useState<Brand[] | null>(null);

  useEffect(() => {
    brandsApi.listAll().then(setBrands);
  }, []);

  const brand = brands?.find((b) => b.id === id);
  if (brands && !brand) notFound();

  return (
    <div>
      <h1 className="text-xl font-semibold text-ink">Sửa thương hiệu</h1>
      <div className="mt-6">
        {brand ? <BrandForm brand={brand} submitLabel="Lưu thay đổi" /> : <Skeleton className="h-64 w-full max-w-lg" />}
      </div>
    </div>
  );
}
