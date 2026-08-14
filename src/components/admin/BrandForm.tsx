"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Brand } from "@/data-access/brands";
import { parseBrandForm } from "@/lib/validation/brand";
import { zodFieldErrors } from "@/lib/validation/utils";
import { brandsApi } from "@/lib/admin-api/brands";
import { triggerRevalidate } from "@/lib/admin-api/revalidate";
import { slugify } from "@/lib/utils/slugify";
import { Field, FormSection, inputClass } from "@/components/admin/form-fields";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

export function BrandForm({ brand, submitLabel }: { brand?: Brand; submitLabel: string }) {
  const router = useRouter();
  const [slug, setSlug] = useState(brand?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(brand));
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const error = (field: string) => fieldErrors[field];

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parsed = parseBrandForm(new FormData(e.currentTarget));
    if (!parsed.success) {
      setFieldErrors(zodFieldErrors(parsed.error));
      setMessage("Vui lòng kiểm tra lại thông tin.");
      return;
    }
    setFieldErrors({});
    setPending(true);
    setMessage("");
    try {
      if (brand) {
        await brandsApi.update(brand.id, parsed.data);
      } else {
        await brandsApi.create(parsed.data);
      }
      triggerRevalidate({ resource: "brand" });
      router.push("/admin/brands");
      router.refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-6">
      <FormSection title="Thông tin thương hiệu">
        <Field label="Tên thương hiệu" error={error("name")}>
          <input
            name="name"
            required
            defaultValue={brand?.name}
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
        <Field label="Mô tả">
          <textarea name="description" rows={3} defaultValue={brand?.description ?? ""} className={inputClass} />
        </Field>
        <ImageUploadField name="logo_url" label="Logo" folder="saxophone/brands" defaultValue={brand?.logo_url} />
        <label className="flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" name="is_active" defaultChecked={brand?.is_active ?? true} className="h-4 w-4" />
          Hiển thị công khai
        </label>
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
