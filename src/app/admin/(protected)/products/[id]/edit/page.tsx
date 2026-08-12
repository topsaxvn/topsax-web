import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductForm } from "@/components/admin/ProductForm";
import { ProductImageManager } from "@/components/admin/ProductImageManager";
import { getAllCategories } from "@/data-access/categories";
import { getAllBrands } from "@/data-access/brands";
import { getProductById, getProductImages } from "@/data-access/products";
import { updateProduct } from "@/app/admin/(protected)/products/actions";

export const metadata: Metadata = { title: "Sửa sản phẩm", robots: { index: false, follow: false } };

export default async function EditProductPage({ params }: PageProps<"/admin/products/[id]/edit">) {
  const { id } = await params;
  const [categories, brands, product] = await Promise.all([
    getAllCategories(),
    getAllBrands(),
    getProductById(id),
  ]);

  if (!product) notFound();

  const images = await getProductImages(id);
  const boundUpdate = updateProduct.bind(null, id);

  return (
    <div>
      <h1 className="text-xl font-semibold text-ink">Sửa sản phẩm</h1>
      <div className="mt-6 max-w-2xl space-y-8">
        <ProductImageManager productId={id} slug={product.slug} images={images} />
        <ProductForm
          action={boundUpdate}
          categories={categories}
          brands={brands}
          product={product}
          submitLabel="Lưu thay đổi"
        />
      </div>
    </div>
  );
}
