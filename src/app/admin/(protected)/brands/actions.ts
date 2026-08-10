"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const brandSchema = z.object({
  name: z.string().trim().min(1, "Tên bắt buộc."),
  slug: z
    .string()
    .trim()
    .min(1, "Slug bắt buộc.")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug chỉ gồm chữ thường, số và dấu -."),
  description: z.string().trim().nullable(),
  logo_url: z.string().trim().nullable(),
  is_active: z.boolean(),
});

export type BrandFormState = {
  status: "idle" | "error";
  message: string;
  fieldErrors?: Partial<Record<string, string>>;
};

function emptyToNull(value: FormDataEntryValue | null): string | null {
  const str = (value ?? "").toString().trim();
  return str === "" ? null : str;
}

function parseForm(formData: FormData) {
  return brandSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: emptyToNull(formData.get("description")),
    logo_url: emptyToNull(formData.get("logo_url")),
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
  revalidatePath("/admin/brands");
  revalidatePath("/saxophone");
  revalidatePath("/phu-kien");
}

export async function createBrand(_prevState: BrandFormState, formData: FormData): Promise<BrandFormState> {
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { status: "error", message: "Vui lòng kiểm tra lại thông tin.", fieldErrors: fieldErrorsFrom(parsed.error) };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("brands").insert(parsed.data);

  if (error) {
    return { status: "error", message: error.code === "23505" ? "Slug đã tồn tại." : "Có lỗi xảy ra, vui lòng thử lại." };
  }

  revalidate();
  redirect("/admin/brands");
}

export async function updateBrand(
  id: string,
  _prevState: BrandFormState,
  formData: FormData,
): Promise<BrandFormState> {
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { status: "error", message: "Vui lòng kiểm tra lại thông tin.", fieldErrors: fieldErrorsFrom(parsed.error) };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("brands").update(parsed.data).eq("id", id);

  if (error) {
    return { status: "error", message: error.code === "23505" ? "Slug đã tồn tại." : "Có lỗi xảy ra, vui lòng thử lại." };
  }

  revalidate();
  redirect("/admin/brands");
}

export async function deleteBrand(id: string) {
  const supabase = await createClient();
  await supabase.from("brands").delete().eq("id", id);
  revalidate();
}

export async function toggleBrandActive(id: string, isActive: boolean) {
  const supabase = await createClient();
  await supabase.from("brands").update({ is_active: isActive }).eq("id", id);
  revalidate();
}
