"use client";

import { useEffect, useState } from "react";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { categoriesApi } from "@/lib/admin-api/categories";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Category } from "@/data-access/categories";

export function NewCategoryPageClient() {
  const [categories, setCategories] = useState<Category[] | null>(null);

  useEffect(() => {
    categoriesApi.listAll().then(setCategories);
  }, []);

  return (
    <div>
      <h1 className="text-xl font-semibold text-ink">Thêm danh mục</h1>
      <div className="mt-6">
        {categories ? (
          <CategoryForm parentOptions={categories} submitLabel="Tạo danh mục" />
        ) : (
          <Skeleton className="h-64 w-full max-w-lg" />
        )}
      </div>
    </div>
  );
}
