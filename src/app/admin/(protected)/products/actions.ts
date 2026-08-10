"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { Database, Json } from "@/types/database";

const productSchema = z.object({
  name: z.string().trim().min(2, "Tên bắt buộc."),
  slug: z
    .string()
    .trim()
    .min(2, "Slug bắt buộc.")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug chỉ gồm chữ thường, số và dấu -."),
  category_id: z.string().nullable(),
  brand_id: z.string().nullable(),
  model: z.string().nullable(),
  sku: z.string().nullable(),
  description: z.string().nullable(),
  short_description: z.string().nullable(),
  price: z.coerce.number().min(0, "Giá phải >= 0."),
  currency: z.string().trim().min(1, "Đơn vị tiền tệ bắt buộc."),
  condition: z.enum(["new", "used", "like_new", "refurbished"]),
  status: z.enum(["available", "sold", "hidden"]),
  inspection_status: z.enum(["pending", "in_progress", "passed", "failed"]),
  featured: z.boolean(),
  stock_quantity: z.coerce.number().int().min(0, "Tồn kho phải >= 0."),
  serial_number: z.string().nullable(),
  year: z.string().nullable(),
  specifications: z.string(),
  meta_title: z.string().nullable(),
  meta_description: z.string().nullable(),
});

export type ProductFormState = {
  status: "idle" | "error";
  message: string;
  fieldErrors?: Partial<Record<string, string>>;
};

function emptyToNull(value: FormDataEntryValue | null): string | null {
  const str = (value ?? "").toString().trim();
  return str === "" ? null : str;
}

function parseProductForm(formData: FormData) {
  return productSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    category_id: emptyToNull(formData.get("category_id")),
    brand_id: emptyToNull(formData.get("brand_id")),
    model: emptyToNull(formData.get("model")),
    sku: emptyToNull(formData.get("sku")),
    description: emptyToNull(formData.get("description")),
    short_description: emptyToNull(formData.get("short_description")),
    price: formData.get("price"),
    currency: (formData.get("currency") || "VND").toString(),
    condition: formData.get("condition"),
    status: formData.get("status"),
    inspection_status: formData.get("inspection_status"),
    featured: formData.get("featured") === "on",
    stock_quantity: (formData.get("stock_quantity") || "1").toString(),
    serial_number: emptyToNull(formData.get("serial_number")),
    year: emptyToNull(formData.get("year")),
    specifications: (formData.get("specifications") || "{}").toString().trim(),
    meta_title: emptyToNull(formData.get("meta_title")),
    meta_description: emptyToNull(formData.get("meta_description")),
  });
}

function buildProductRow(data: z.infer<typeof productSchema>):
  | { ok: true; value: Database["public"]["Tables"]["products"]["Insert"] }
  | { ok: false; message: string } {
  let specifications: Record<string, Json>;
  try {
    const parsed: unknown = JSON.parse(data.specifications || "{}");
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) throw new Error("invalid");
    specifications = parsed as Record<string, Json>;
  } catch {
    return { ok: false, message: "Thông số kỹ thuật (JSON) không hợp lệ." };
  }

  let year: number | null = null;
  if (data.year) {
    const parsedYear = Number(data.year);
    if (!Number.isInteger(parsedYear) || parsedYear < 1900 || parsedYear > 2100) {
      return { ok: false, message: "Năm sản xuất không hợp lệ (1900-2100)." };
    }
    year = parsedYear;
  }

  return {
    ok: true,
    value: {
      name: data.name,
      slug: data.slug,
      category_id: data.category_id,
      brand_id: data.brand_id,
      model: data.model,
      sku: data.sku,
      description: data.description,
      short_description: data.short_description,
      price: data.price,
      currency: data.currency,
      condition: data.condition,
      status: data.status,
      inspection_status: data.inspection_status,
      featured: data.featured,
      stock_quantity: data.stock_quantity,
      serial_number: data.serial_number,
      year,
      specifications,
      meta_title: data.meta_title,
      meta_description: data.meta_description,
    },
  };
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

function revalidateProductPaths() {
  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath("/saxophone");
  revalidatePath("/phu-kien");
}

export async function createProduct(
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const parsed = parseProductForm(formData);
  if (!parsed.success) {
    return { status: "error", message: "Vui lòng kiểm tra lại thông tin.", fieldErrors: fieldErrorsFrom(parsed.error) };
  }

  const row = buildProductRow(parsed.data);
  if (!row.ok) return { status: "error", message: row.message };

  const supabase = await createClient();
  const { error } = await supabase.from("products").insert(row.value);

  if (error) {
    return {
      status: "error",
      message: error.code === "23505" ? "Slug đã tồn tại, vui lòng chọn slug khác." : "Có lỗi xảy ra, vui lòng thử lại.",
    };
  }

  revalidateProductPaths();
  redirect("/admin/products");
}

export async function updateProduct(
  id: string,
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const parsed = parseProductForm(formData);
  if (!parsed.success) {
    return { status: "error", message: "Vui lòng kiểm tra lại thông tin.", fieldErrors: fieldErrorsFrom(parsed.error) };
  }

  const row = buildProductRow(parsed.data);
  if (!row.ok) return { status: "error", message: row.message };

  const supabase = await createClient();
  const { error } = await supabase.from("products").update(row.value).eq("id", id);

  if (error) {
    return {
      status: "error",
      message: error.code === "23505" ? "Slug đã tồn tại, vui lòng chọn slug khác." : "Có lỗi xảy ra, vui lòng thử lại.",
    };
  }

  revalidateProductPaths();
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();
  await supabase.from("products").delete().eq("id", id);
  revalidateProductPaths();
}

export async function setProductStatus(id: string, status: Database["public"]["Enums"]["product_status"]) {
  const supabase = await createClient();
  await supabase.from("products").update({ status }).eq("id", id);
  revalidateProductPaths();
}

export async function setInspectionStatus(
  id: string,
  inspection_status: Database["public"]["Enums"]["product_inspection_status"],
) {
  const supabase = await createClient();
  await supabase.from("products").update({ inspection_status }).eq("id", id);
  revalidateProductPaths();
}
