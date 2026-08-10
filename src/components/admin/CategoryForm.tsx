"use client";

import { useActionState, useState } from "react";
import type { Category } from "@/data-access/categories";
import type { CategoryFormState } from "@/app/admin/(protected)/categories/actions";
import { slugify } from "@/lib/utils/slugify";
import { Field, FormSection, inputClass } from "@/components/admin/form-fields";

type Action = (prevState: CategoryFormState, formData: FormData) => Promise<CategoryFormState>;

const initialState: CategoryFormState = { status: "idle", message: "" };

export function CategoryForm({
  action,
  parentOptions,
  category,
  submitLabel,
}: {
  action: Action;
  parentOptions: Category[];
  category?: Category;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(category));

  const error = (field: string) => state.fieldErrors?.[field];

  return (
    <form action={formAction} className="max-w-lg space-y-6">
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
        {state.status === "error" && <p className="text-sm text-red-600">{state.message}</p>}
      </div>
    </form>
  );
}
