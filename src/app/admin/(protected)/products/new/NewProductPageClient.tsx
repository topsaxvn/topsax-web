"use client";

import { useEffect, useState } from "react";
import { ProductForm } from "@/components/admin/ProductForm";
import { NewProductImageUpload } from "@/components/admin/NewProductImageUpload";
import { categoriesApi } from "@/lib/admin-api/categories";
import { brandsApi } from "@/lib/admin-api/brands";
import { productsApi } from "@/lib/admin-api/products";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Category } from "@/data-access/categories";
import type { Brand } from "@/data-access/brands";

export function NewProductPageClient() {
  const [data, setData] = useState<{
    categories: Category[];
    brands: Brand[];
    courses: { id: string; title: string }[];
  } | null>(null);

  useEffect(() => {
    Promise.all([categoriesApi.listAll(), brandsApi.listAll(), productsApi.listCourses()]).then(([categories, brands, courses]) =>
      setData({ categories, brands, courses }),
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
            courses={data.courses}
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
