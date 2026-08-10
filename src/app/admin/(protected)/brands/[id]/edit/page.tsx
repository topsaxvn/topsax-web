import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BrandForm } from "@/components/admin/BrandForm";
import { getAllBrands } from "@/data-access/brands";
import { updateBrand } from "@/app/admin/(protected)/brands/actions";

export const metadata: Metadata = { title: "Sửa thương hiệu", robots: { index: false, follow: false } };

export default async function EditBrandPage({ params }: PageProps<"/admin/brands/[id]/edit">) {
  const { id } = await params;
  const brands = await getAllBrands();
  const brand = brands.find((b) => b.id === id);

  if (!brand) notFound();

  return (
    <div>
      <h1 className="text-xl font-semibold text-ink">Sửa thương hiệu</h1>
      <div className="mt-6">
        <BrandForm action={updateBrand.bind(null, id)} brand={brand} submitLabel="Lưu thay đổi" />
      </div>
    </div>
  );
}
