import type { Metadata } from "next";
import { ProductForm } from "@/components/admin/ProductForm";
import { NewProductImageUpload } from "@/components/admin/NewProductImageUpload";
import { getAllCategories } from "@/data-access/categories";
import { getAllBrands } from "@/data-access/brands";
import { createProduct } from "@/app/admin/(protected)/products/actions";

export const metadata: Metadata = { title: "Thêm sản phẩm", robots: { index: false, follow: false } };

export default async function NewProductPage() {
  const [categories, brands] = await Promise.all([getAllCategories(), getAllBrands()]);

  return (
    <div>
      <h1 className="text-xl font-semibold text-ink">Thêm sản phẩm</h1>
      <div className="mt-6 max-w-2xl">
        <ProductForm
          action={createProduct}
          categories={categories}
          brands={brands}
          submitLabel="Tạo sản phẩm"
          imagesSection={<NewProductImageUpload />}
        />
      </div>
    </div>
  );
}
