"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const categorySchema = z.object({
  name: z.string().trim().min(1, "Tên bắt buộc."),
  slug: z
    .string()
    .trim()
    .min(1, "Slug bắt buộc.")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug chỉ gồm chữ thường, số và dấu -."),
  description: z.string().trim().nullable(),
  parent_id: z.string().nullable(),
  sort_order: z.coerce.number().int(),
  is_active: z.boolean(),
});

export type CategoryFormState = {
  status: "idle" | "error";
  message: string;
  fieldErrors?: Partial<Record<string, string>>;
};

function emptyToNull(value: FormDataEntryValue | null): string | null {
  const str = (value ?? "").toString().trim();
  return str === "" ? null : str;
}

function parseForm(formData: FormData) {
  return categorySchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: emptyToNull(formData.get("description")),
    parent_id: emptyToNull(formData.get("parent_id")),
    sort_order: (formData.get("sort_order") || "0").toString(),
    is_active: formData.get("is_active") === "on",
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

function revalidate() {
  revalidatePath("/admin/categories");
  revalidatePath("/");
  revalidatePath("/saxophone");
  revalidatePath("/phu-kien");
}

export async function createCategory(
  _prevState: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { status: "error", message: "Vui lòng kiểm tra lại thông tin.", fieldErrors: fieldErrorsFrom(parsed.error) };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("categories").insert(parsed.data);

  if (error) {
    return {
      status: "error",
      message: error.code === "23505" ? "Slug đã tồn tại." : "Có lỗi xảy ra, vui lòng thử lại.",
    };
  }

  revalidate();
  redirect("/admin/categories");
}

export async function updateCategory(
  id: string,
  _prevState: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { status: "error", message: "Vui lòng kiểm tra lại thông tin.", fieldErrors: fieldErrorsFrom(parsed.error) };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("categories").update(parsed.data).eq("id", id);

  if (error) {
    return {
      status: "error",
      message: error.code === "23505" ? "Slug đã tồn tại." : "Có lỗi xảy ra, vui lòng thử lại.",
    };
  }

  revalidate();
  redirect("/admin/categories");
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  await supabase.from("categories").delete().eq("id", id);
  revalidate();
}

export async function toggleCategoryActive(id: string, isActive: boolean) {
  const supabase = await createClient();
  await supabase.from("categories").update({ is_active: isActive }).eq("id", id);
  revalidate();
}
