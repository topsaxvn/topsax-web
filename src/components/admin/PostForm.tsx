"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { BlogCategory, PostSummary } from "@/data-access/posts";
import { parsePostForm } from "@/lib/validation/post";
import { zodFieldErrors } from "@/lib/validation/utils";
import { postsApi } from "@/lib/admin-api/posts";
import { triggerRevalidate } from "@/lib/admin-api/revalidate";
import { slugify } from "@/lib/utils/slugify";
import { Field, FormSection, inputClass } from "@/components/admin/form-fields";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

const statuses = [
  { value: "draft", label: "Nháp" },
  { value: "published", label: "Đã xuất bản" },
  { value: "archived", label: "Lưu trữ" },
];

export function PostForm({
  categories,
  post,
  submitLabel,
}: {
  categories: BlogCategory[];
  post?: PostSummary;
  submitLabel: string;
}) {
  const router = useRouter();
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post));
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const error = (field: string) => fieldErrors[field];

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parsed = parsePostForm(new FormData(e.currentTarget));
    if (!parsed.success) {
      setFieldErrors(zodFieldErrors(parsed.error));
      setMessage("Vui lòng kiểm tra lại thông tin.");
      return;
    }
    setFieldErrors({});
    setPending(true);
    setMessage("");
    try {
      if (post) {
        await postsApi.update(post.id, parsed.data);
      } else {
        await postsApi.create(parsed.data);
      }
      triggerRevalidate({ resource: "post", slug: parsed.data.slug });
      router.push("/admin/blog");
      router.refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
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
        {message && <p className="text-sm text-red-600">{message}</p>}
      </div>
    </form>
  );
}
