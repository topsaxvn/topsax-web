import Link from "next/link";
import type { Metadata } from "next";
import { getAllCategories } from "@/data-access/categories";
import { deleteCategory, toggleCategoryActive } from "@/app/admin/(protected)/categories/actions";
import { ConfirmButton } from "@/components/admin/ConfirmButton";

export const metadata: Metadata = { title: "Danh mục", robots: { index: false, follow: false } };

export default async function AdminCategoriesPage() {
  const categories = await getAllCategories();
  const byId = new Map(categories.map((c) => [c.id, c]));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-xl font-semibold text-ink">Danh mục</h1>
        <Link
          href="/admin/categories/new"
          className="rounded-full bg-brass px-4 py-2 text-sm font-semibold text-ink hover:bg-brass-soft"
        >
          + Thêm danh mục
        </Link>
      </div>

      {categories.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-border bg-paper px-4 py-10 text-center text-sm text-muted">
          Chưa có danh mục nào.
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="mt-6 hidden overflow-x-auto rounded-2xl border border-border bg-paper md:block">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-border text-xs uppercase text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Tên</th>
                  <th className="px-4 py-3 font-medium">Danh mục cha</th>
                  <th className="px-4 py-3 font-medium">Hiển thị</th>
                  <th className="px-4 py-3 font-medium">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-ink">{category.name}</p>
                      <p className="text-xs text-muted">/{category.slug}</p>
                    </td>
                    <td className="px-4 py-3 text-ink-soft">
                      {category.parent_id ? byId.get(category.parent_id)?.name ?? "-" : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <form action={toggleCategoryActive.bind(null, category.id, !category.is_active)}>
                        <button type="submit" className="text-ink-soft hover:underline">
                          {category.is_active ? "Đang hiện" : "Đang ẩn"}
                        </button>
                      </form>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <Link href={`/admin/categories/${category.id}/edit`} className="text-brass-deep hover:underline">
                          Sửa
                        </Link>
                        <form action={deleteCategory.bind(null, category.id)}>
                          <ConfirmButton
                            confirmMessage={`Xóa danh mục "${category.name}"?`}
                            className="text-red-600 hover:underline"
                          >
                            Xóa
                          </ConfirmButton>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="mt-6 space-y-3 md:hidden">
            {categories.map((category) => (
              <div key={category.id} className="rounded-2xl border border-border bg-paper p-3">
                <p className="font-medium text-ink">{category.name}</p>
                <p className="text-xs text-muted">/{category.slug}</p>
                <p className="mt-1 text-xs text-muted">
                  Danh mục cha: {category.parent_id ? byId.get(category.parent_id)?.name ?? "-" : "-"}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-border pt-2 text-sm">
                  <Link href={`/admin/categories/${category.id}/edit`} className="text-brass-deep hover:underline">
                    Sửa
                  </Link>
                  <form action={toggleCategoryActive.bind(null, category.id, !category.is_active)}>
                    <button type="submit" className="text-ink-soft hover:underline">
                      {category.is_active ? "Đang hiện" : "Đang ẩn"}
                    </button>
                  </form>
                  <form action={deleteCategory.bind(null, category.id)}>
                    <ConfirmButton
                      confirmMessage={`Xóa danh mục "${category.name}"?`}
                      className="text-red-600 hover:underline"
                    >
                      Xóa
                    </ConfirmButton>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
