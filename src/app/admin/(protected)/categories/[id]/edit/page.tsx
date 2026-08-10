import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { getAllCategories } from "@/data-access/categories";
import { updateCategory } from "@/app/admin/(protected)/categories/actions";

export const metadata: Metadata = { title: "Sửa danh mục", robots: { index: false, follow: false } };

export default async function EditCategoryPage({ params }: PageProps<"/admin/categories/[id]/edit">) {
  const { id } = await params;
  const categories = await getAllCategories();
  const category = categories.find((c) => c.id === id);

  if (!category) notFound();

  return (
    <div>
      <h1 className="text-xl font-semibold text-ink">Sửa danh mục</h1>
      <div className="mt-6">
        <CategoryForm
          action={updateCategory.bind(null, id)}
          parentOptions={categories}
          category={category}
          submitLabel="Lưu thay đổi"
        />
      </div>
    </div>
  );
}
