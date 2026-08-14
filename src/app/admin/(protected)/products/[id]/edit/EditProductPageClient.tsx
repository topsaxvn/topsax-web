"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { ProductImageManager } from "@/components/admin/ProductImageManager";
import { categoriesApi } from "@/lib/admin-api/categories";
import { brandsApi } from "@/lib/admin-api/brands";
import { productsApi } from "@/lib/admin-api/products";
import { productImagesApi } from "@/lib/admin-api/product-images";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Category } from "@/data-access/categories";
import type { Brand } from "@/data-access/brands";
import type { ProductDetail, ProductImageRow } from "@/data-access/products";

type LoadedState = {
  categories: Category[];
  brands: Brand[];
  product: ProductDetail | null;
  images: ProductImageRow[];
};

export function EditProductPageClient() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [data, setData] = useState<LoadedState | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([categoriesApi.listAll(), brandsApi.listAll(), productsApi.getById(id), productImagesApi.list(id)]).then(
      ([categories, brands, product, images]) => {
        if (!cancelled) setData({ categories, brands, product, images });
      },
    );
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (data && !data.product) notFound();

  return (
    <div>
      <h1 className="text-xl font-semibold text-ink">Sửa sản phẩm</h1>
      <div className="mt-6 max-w-2xl space-y-8">
        {data && data.product ? (
          <>
            <ProductImageManager productId={id} slug={data.product.slug} images={data.images} />
            <ProductForm categories={data.categories} brands={data.brands} product={data.product} submitLabel="Lưu thay đổi" />
          </>
        ) : (
          <div className="space-y-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        )}
      </div>
    </div>
  );
}
