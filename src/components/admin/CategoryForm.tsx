"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Category } from "@/data-access/categories";
import { parseCategoryForm } from "@/lib/validation/category";
import { zodFieldErrors } from "@/lib/validation/utils";
import { categoriesApi } from "@/lib/admin-api/categories";
import { triggerRevalidate } from "@/lib/admin-api/revalidate";
import { slugify } from "@/lib/utils/slugify";
import { Field, FormSection, inputClass } from "@/components/admin/form-fields";

export function CategoryForm({
  parentOptions,
  category,
  submitLabel,
}: {
  parentOptions: Category[];
  category?: Category;
  submitLabel: string;
}) {
  const router = useRouter();
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(category));
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const error = (field: string) => fieldErrors[field];

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parsed = parseCategoryForm(new FormData(e.currentTarget));
    if (!parsed.success) {
      setFieldErrors(zodFieldErrors(parsed.error));
      setMessage("Vui lòng kiểm tra lại thông tin.");
      return;
    }
    setFieldErrors({});
    setPending(true);
    setMessage("");
    try {
      if (category) {
        await categoriesApi.update(category.id, parsed.data);
      } else {
        await categoriesApi.create(parsed.data);
      }
      triggerRevalidate({ resource: "category" });
      router.push("/admin/categories");
      router.refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-6">
      <FormSection title="Thông tin danh mục">
        <Field label="Tên danh mục" error={error("name")}>
          <input
            name="name"
            required
            defaultValue={category?.name}
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
        <Field label="Danh mục cha">
          <select name="parent_id" defaultValue={category?.parent_id ?? ""} className={inputClass}>
            <option value="">-- Không có (danh mục gốc) --</option>
            {parentOptions
              .filter((c) => c.id !== category?.id)
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
          </select>
        </Field>
        <Field label="Mô tả">
          <textarea name="description" rows={3} defaultValue={category?.description ?? ""} className={inputClass} />
        </Field>
        <Field label="Thứ tự hiển thị">
          <input name="sort_order" type="number" defaultValue={category?.sort_order ?? 0} className={inputClass} />
        </Field>
        <label className="flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" name="is_active" defaultChecked={category?.is_active ?? true} className="h-4 w-4" />
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
