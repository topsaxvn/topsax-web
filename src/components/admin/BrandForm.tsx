"use client";

import { useActionState, useState } from "react";
import type { Brand } from "@/data-access/brands";
import type { BrandFormState } from "@/app/admin/(protected)/brands/actions";
import { slugify } from "@/lib/utils/slugify";
import { Field, FormSection, inputClass } from "@/components/admin/form-fields";

type Action = (prevState: BrandFormState, formData: FormData) => Promise<BrandFormState>;

const initialState: BrandFormState = { status: "idle", message: "" };

export function BrandForm({
  action,
  brand,
  submitLabel,
}: {
  action: Action;
  brand?: Brand;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [slug, setSlug] = useState(brand?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(brand));

  const error = (field: string) => state.fieldErrors?.[field];

  return (
    <form action={formAction} className="max-w-lg space-y-6">
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
        <Field label="Logo URL">
          <input name="logo_url" defaultValue={brand?.logo_url ?? ""} className={inputClass} />
        </Field>
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
        {state.status === "error" && <p className="text-sm text-red-600">{state.message}</p>}
      </div>
    </form>
  );
}
