"use client";

import { useEffect, useState } from "react";
import { PostForm } from "@/components/admin/PostForm";
import { blogCategoriesApi } from "@/lib/admin-api/posts";
import { Skeleton } from "@/components/ui/Skeleton";
import type { BlogCategory } from "@/data-access/posts";

export function NewPostPageClient() {
  const [categories, setCategories] = useState<BlogCategory[] | null>(null);

  useEffect(() => {
    blogCategoriesApi.listAll().then(setCategories);
  }, []);

  return (
    <div>
      <h1 className="text-xl font-semibold text-ink">Thêm bài viết</h1>
      <div className="mt-6 max-w-2xl">
        {categories ? (
          <PostForm categories={categories} submitLabel="Tạo bài viết" />
        ) : (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        )}
      </div>
    </div>
  );
}
