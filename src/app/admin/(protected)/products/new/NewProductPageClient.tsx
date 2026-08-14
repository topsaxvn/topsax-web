"use client";

import { useEffect, useState } from "react";
import { ProductForm } from "@/components/admin/ProductForm";
import { NewProductImageUpload } from "@/components/admin/NewProductImageUpload";
import { categoriesApi } from "@/lib/admin-api/categories";
import { brandsApi } from "@/lib/admin-api/brands";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Category } from "@/data-access/categories";
import type { Brand } from "@/data-access/brands";

export function NewProductPageClient() {
  const [data, setData] = useState<{ categories: Category[]; brands: Brand[] } | null>(null);

  useEffect(() => {
    Promise.all([categoriesApi.listAll(), brandsApi.listAll()]).then(([categories, brands]) =>
      setData({ categories, brands }),
    );
  }, []);

  return (
    <div>
      <h1 className="text-xl font-semibold text-ink">Thêm sản phẩm</h1>
      <div className="mt-6 max-w-2xl">
        {data ? (
          <ProductForm
            categories={data.categories}
            brands={data.brands}
            submitLabel="Tạo sản phẩm"
            imagesSection={<NewProductImageUpload />}
          />
        ) : (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        )}
      </div>
    </div>
  );
}
