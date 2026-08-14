"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { categoriesApi } from "@/lib/admin-api/categories";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Category } from "@/data-access/categories";

export function EditCategoryPageClient() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [categories, setCategories] = useState<Category[] | null>(null);

  useEffect(() => {
    categoriesApi.listAll().then(setCategories);
  }, []);

  const category = categories?.find((c) => c.id === id);
  if (categories && !category) notFound();

  return (
    <div>
      <h1 className="text-xl font-semibold text-ink">Sửa danh mục</h1>
      <div className="mt-6">
        {categories && category ? (
          <CategoryForm parentOptions={categories} category={category} submitLabel="Lưu thay đổi" />
        ) : (
          <Skeleton className="h-64 w-full max-w-lg" />
        )}
      </div>
    </div>
  );
}
