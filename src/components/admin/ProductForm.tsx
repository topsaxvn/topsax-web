"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { Category } from "@/data-access/categories";
import type { Brand } from "@/data-access/brands";
import type { ProductDetail } from "@/data-access/products";
import { buildProductRow, parseProductForm, parsePendingImages } from "@/lib/validation/product";
import { zodFieldErrors } from "@/lib/validation/utils";
import { productsApi } from "@/lib/admin-api/products";
import { triggerRevalidate } from "@/lib/admin-api/revalidate";
import { Field, FormSection, inputClass } from "@/components/admin/form-fields";
import { slugify } from "@/lib/utils/slugify";

const conditions = [
  { value: "new", label: "Mới" },
  { value: "used", label: "Đã qua sử dụng" },
  { value: "like_new", label: "Like new" },
  { value: "refurbished", label: "Tân trang" },
];

const statuses = [
  { value: "available", label: "Còn hàng" },
  { value: "sold", label: "Đã bán" },
  { value: "hidden", label: "Ẩn" },
];

const inspectionStatuses = [
  { value: "pending", label: "Chờ kiểm tra" },
  { value: "in_progress", label: "Đang kiểm tra" },
  { value: "passed", label: "Đạt - sẵn sàng bán" },
  { value: "failed", label: "Không đạt" },
];

export function ProductForm({
  categories,
  brands,
  product,
  submitLabel,
  imagesSection,
}: {
  categories: Category[];
  brands: Brand[];
  product?: ProductDetail;
  submitLabel: string;
  imagesSection?: ReactNode;
}) {
  const router = useRouter();
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(product));
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const error = (field: string) => fieldErrors[field];

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const parsed = parseProductForm(formData);
    if (!parsed.success) {
      setFieldErrors(zodFieldErrors(parsed.error));
      setMessage("Vui lòng kiểm tra lại thông tin.");
      return;
    }
    setFieldErrors({});

    const row = buildProductRow(parsed.data);
    if (!row.ok) {
      setMessage(row.message);
      return;
    }

    setPending(true);
    setMessage("");
    try {
      if (product) {
        await productsApi.update(product.id, row.value);
        triggerRevalidate({ resource: "product", slug: row.value.slug ?? undefined });
      } else {
        const pendingImages = parsePendingImages(formData);
        await productsApi.create(row.value, pendingImages);
        triggerRevalidate({ resource: "product" });
      }
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <FormSection title="Thông tin chung">
        <Field label="Tên sản phẩm" error={error("name")}>
          <input
            name="name"
            required
            defaultValue={product?.name}
            onChange={(e) => {
              if (!slugTouched) setSlug(slugify(e.target.value));
            }}
            className={inputClass}
          />
        </Field>
        <Field label="Slug" error={error("slug")}>
          <input
            name="slug"
            required
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
            className={inputClass}
          />
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Danh mục">
            <select name="category_id" defaultValue={product?.category?.id ?? ""} className={inputClass}>
              <option value="">-- Chọn danh mục --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Thương hiệu">
            <select name="brand_id" defaultValue={product?.brand?.id ?? ""} className={inputClass}>
              <option value="">-- Chọn thương hiệu --</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Model">
            <input name="model" defaultValue={product?.model ?? ""} className={inputClass} />
          </Field>
          <Field label="SKU">
            <input
              name="sku"
              defaultValue={product?.sku ?? ""}
              placeholder={product ? "" : "Để trống để tự sinh mã (K.../P...)"}
              className={inputClass}
            />
          </Field>
        </div>
      </FormSection>

      <FormSection title="Giá & tình trạng">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Giá" error={error("price")}>
            <input
              name="price"
              type="number"
              min={0}
              step={1000}
              required
              defaultValue={product?.price}
              className={inputClass}
            />
          </Field>
          <Field label="Đơn vị tiền tệ">
            <input name="currency" defaultValue={product?.currency ?? "VND"} className={inputClass} />
          </Field>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Tình trạng">
            <select name="condition" defaultValue={product?.condition ?? "used"} className={inputClass}>
              {conditions.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Trạng thái hàng">
            <select name="status" defaultValue={product?.status ?? "available"} className={inputClass}>
              {statuses.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Trạng thái kiểm tra">
            <select
              name="inspection_status"
              defaultValue={product?.inspection_status ?? "pending"}
              className={inputClass}
            >
              {inspectionStatuses.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Tồn kho">
            <input
              name="stock_quantity"
              type="number"
              min={0}
              defaultValue={product?.stock_quantity ?? 1}
              className={inputClass}
            />
          </Field>
          <label className="flex items-center gap-2 text-sm text-ink sm:mt-6">
            <input type="checkbox" name="featured" defaultChecked={product?.featured} className="h-4 w-4" />
            Sản phẩm nổi bật
          </label>
        </div>
      </FormSection>

      <FormSection title="Mô tả">
        <Field label="Mô tả ngắn">
          <input name="short_description" defaultValue={product?.short_description ?? ""} className={inputClass} />
        </Field>
        <Field label="Mô tả chi tiết">
          <textarea name="description" rows={5} defaultValue={product?.description ?? ""} className={inputClass} />
        </Field>
      </FormSection>

      <FormSection title="Thông số">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Số serial">
            <input name="serial_number" defaultValue={product?.serial_number ?? ""} className={inputClass} />
          </Field>
          <Field label="Năm sản xuất" error={error("year")}>
            <input name="year" type="number" defaultValue={product?.year ?? ""} className={inputClass} />
          </Field>
        </div>
        <Field label="Thông số khác (JSON)">
          <textarea
            name="specifications"
            rows={4}
            defaultValue={JSON.stringify(product?.specifications ?? {}, null, 2)}
            className={`${inputClass} font-mono text-xs`}
            placeholder='{"key": "Eb", "pad_condition": "good"}'
          />
        </Field>
      </FormSection>

      {imagesSection}

      <FormSection title="SEO">
        <Field label="Meta title">
          <input name="meta_title" defaultValue={product?.meta_title ?? ""} className={inputClass} />
        </Field>
        <Field label="Meta description">
          <textarea name="meta_description" rows={2} defaultValue={product?.meta_description ?? ""} className={inputClass} />
        </Field>
      </FormSection>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-paper hover:bg-ink-soft disabled:opacity-60"
        >
          {pending ? "Đang lưu..." : submitLabel}
        </button>
        {message && <p className="text-sm text-red-600">{message}</p>}
      </div>
    </form>
  );
}
