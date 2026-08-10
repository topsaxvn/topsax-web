import type { Metadata } from "next";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { getAllCategories } from "@/data-access/categories";
import { createCategory } from "@/app/admin/(protected)/categories/actions";

export const metadata: Metadata = { title: "Thêm danh mục", robots: { index: false, follow: false } };

export default async function NewCategoryPage() {
  const categories = await getAllCategories();

  return (
    <div>
      <h1 className="text-xl font-semibold text-ink">Thêm danh mục</h1>
      <div className="mt-6">
        <CategoryForm action={createCategory} parentOptions={categories} submitLabel="Tạo danh mục" />
      </div>
    </div>
  );
}
