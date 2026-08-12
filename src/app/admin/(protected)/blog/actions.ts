"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

const postSchema = z.object({
  title: z.string().trim().min(2, "Tiêu đề bắt buộc."),
  slug: z
    .string()
    .trim()
    .min(2, "Slug bắt buộc.")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug chỉ gồm chữ thường, số và dấu -."),
  excerpt: z.string().nullable(),
  content: z.string().trim().min(1, "Nội dung bắt buộc."),
  thumbnail_url: z.string().nullable(),
  category_id: z.string().nullable(),
  status: z.enum(["draft", "published", "archived"]),
  meta_title: z.string().nullable(),
  meta_description: z.string().nullable(),
});

export type PostFormState = {
  status: "idle" | "error";
  message: string;
  fieldErrors?: Partial<Record<string, string>>;
};

function emptyToNull(value: FormDataEntryValue | null): string | null {
  const str = (value ?? "").toString().trim();
  return str === "" ? null : str;
}

function parsePostForm(formData: FormData) {
  return postSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: emptyToNull(formData.get("excerpt")),
    content: formData.get("content"),
    thumbnail_url: emptyToNull(formData.get("thumbnail_url")),
    category_id: emptyToNull(formData.get("category_id")),
    status: formData.get("status"),
    meta_title: emptyToNull(formData.get("meta_title")),
    meta_description: emptyToNull(formData.get("meta_description")),
  });
}

function fieldErrorsFrom(error: z.ZodError): Record<string, string> {
  const flat = error.flatten().fieldErrors;
  const result: Record<string, string> = {};
  for (const key in flat) {
    const messages = flat[key as keyof typeof flat];
    if (messages?.[0]) result[key] = messages[0];
  }
  return result;
}

function revalidatePostPaths(slug?: string) {
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  if (slug) revalidatePath(`/blog/${slug}`);
}

export async function createPost(_prevState: PostFormState, formData: FormData): Promise<PostFormState> {
  const parsed = parsePostForm(formData);
  if (!parsed.success) {
    return { status: "error", message: "Vui lòng kiểm tra lại thông tin.", fieldErrors: fieldErrorsFrom(parsed.error) };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const row: Database["public"]["Tables"]["posts"]["Insert"] = {
    ...parsed.data,
    author_id: user?.id ?? null,
    published_at: parsed.data.status === "published" ? new Date().toISOString() : null,
  };

  const { error } = await supabase.from("posts").insert(row);

  if (error) {
    return {
      status: "error",
      message: error.code === "23505" ? "Slug đã tồn tại, vui lòng chọn slug khác." : "Có lỗi xảy ra, vui lòng thử lại.",
    };
  }

  revalidatePostPaths(parsed.data.slug);
  redirect("/admin/blog");
}

export async function updatePost(id: string, _prevState: PostFormState, formData: FormData): Promise<PostFormState> {
  const parsed = parsePostForm(formData);
  if (!parsed.success) {
    return { status: "error", message: "Vui lòng kiểm tra lại thông tin.", fieldErrors: fieldErrorsFrom(parsed.error) };
  }

  const supabase = await createClient();
  const { data: existing } = await supabase.from("posts").select("status,published_at").eq("id", id).maybeSingle();

  const publishedAt =
    parsed.data.status === "published"
      ? existing?.published_at ?? new Date().toISOString()
      : existing?.status === "published"
        ? existing.published_at
        : null;

  const row: Database["public"]["Tables"]["posts"]["Update"] = {
    ...parsed.data,
    published_at: publishedAt,
  };

  const { error } = await supabase.from("posts").update(row).eq("id", id);

  if (error) {
    return {
      status: "error",
      message: error.code === "23505" ? "Slug đã tồn tại, vui lòng chọn slug khác." : "Có lỗi xảy ra, vui lòng thử lại.",
    };
  }

  revalidatePostPaths(parsed.data.slug);
  redirect("/admin/blog");
}

export async function deletePost(id: string, slug: string) {
  const supabase = await createClient();
  await supabase.from("posts").delete().eq("id", id);
  revalidatePostPaths(slug);
}

export async function setPostStatus(id: string, slug: string, status: Database["public"]["Enums"]["post_status"]) {
  const supabase = await createClient();
  const { data: existing } = await supabase.from("posts").select("published_at").eq("id", id).maybeSingle();

  await supabase
    .from("posts")
    .update({
      status,
      published_at: status === "published" ? existing?.published_at ?? new Date().toISOString() : existing?.published_at ?? null,
    })
    .eq("id", id);

  revalidatePostPaths(slug);
}
