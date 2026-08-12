"use client";

import { useActionState, useState } from "react";
import type { BlogCategory, PostSummary } from "@/data-access/posts";
import type { PostFormState } from "@/app/admin/(protected)/blog/actions";
import { slugify } from "@/lib/utils/slugify";
import { Field, FormSection, inputClass } from "@/components/admin/form-fields";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

type Action = (prevState: PostFormState, formData: FormData) => Promise<PostFormState>;

const initialState: PostFormState = { status: "idle", message: "" };

const statuses = [
  { value: "draft", label: "Nháp" },
  { value: "published", label: "Đã xuất bản" },
  { value: "archived", label: "Lưu trữ" },
];

export function PostForm({
  action,
  categories,
  post,
  submitLabel,
}: {
  action: Action;
  categories: BlogCategory[];
  post?: PostSummary;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post));

  const error = (field: string) => state.fieldErrors?.[field];

  return (
    <form action={formAction} className="max-w-2xl space-y-8">
      <FormSection title="Nội dung">
        <Field label="Tiêu đề" error={error("title")}>
          <input
            name="title"
            required
            defaultValue={post?.title}
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
        <Field label="Tóm tắt">
          <textarea name="excerpt" rows={2} defaultValue={post?.excerpt ?? ""} className={inputClass} />
        </Field>
        <Field label="Nội dung (Markdown)" error={error("content")}>
          <textarea name="content" rows={16} required defaultValue={post?.content ?? ""} className={`${inputClass} font-mono text-xs`} />
        </Field>
      </FormSection>

      <FormSection title="Phân loại & trạng thái">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Chuyên mục">
            <select name="category_id" defaultValue={post?.category?.id ?? ""} className={inputClass}>
              <option value="">-- Chọn chuyên mục --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Trạng thái">
            <select name="status" defaultValue={post?.status ?? "draft"} className={inputClass}>
              {statuses.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </FormSection>

      <FormSection title="Ảnh đại diện">
        <ImageUploadField name="thumbnail_url" label="Ảnh thumbnail" folder="saxophone/blog" defaultValue={post?.thumbnail_url} />
      </FormSection>

      <FormSection title="SEO">
        <Field label="Meta title">
          <input name="meta_title" defaultValue={post?.meta_title ?? ""} className={inputClass} />
        </Field>
        <Field label="Meta description">
          <textarea name="meta_description" rows={2} defaultValue={post?.meta_description ?? ""} className={inputClass} />
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
        {state.status === "error" && <p className="text-sm text-red-600">{state.message}</p>}
      </div>
    </form>
  );
}
