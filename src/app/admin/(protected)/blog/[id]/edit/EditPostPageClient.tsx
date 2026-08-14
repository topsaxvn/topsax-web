"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import { PostForm } from "@/components/admin/PostForm";
import { postsApi, blogCategoriesApi } from "@/lib/admin-api/posts";
import { Skeleton } from "@/components/ui/Skeleton";
import type { BlogCategory, PostSummary } from "@/data-access/posts";

export function EditPostPageClient() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [data, setData] = useState<{ categories: BlogCategory[]; post: PostSummary | null } | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([blogCategoriesApi.listAll(), postsApi.getById(id)]).then(([categories, post]) => {
      if (!cancelled) setData({ categories, post });
    });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (data && !data.post) notFound();

  return (
    <div>
      <h1 className="text-xl font-semibold text-ink">Sửa bài viết</h1>
      <div className="mt-6">
        {data && data.post ? (
          <PostForm categories={data.categories} post={data.post} submitLabel="Lưu thay đổi" />
        ) : (
          <div className="max-w-2xl space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        )}
      </div>
    </div>
  );
}
