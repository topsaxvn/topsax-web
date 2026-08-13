import { z } from "zod";
import { emptyToNull } from "@/lib/validation/utils";
import type { Database, Json } from "@/types/database";

export const productSchema = z.object({
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

export type ProductFormValues = z.infer<typeof productSchema>;

export function parseProductForm(formData: FormData) {
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

export function buildProductRow(data: ProductFormValues):
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

export const pendingImageSchema = z.array(z.object({ url: z.string().trim().min(1), publicId: z.string().trim().min(1) }));

export function parsePendingImages(formData: FormData): { url: string; publicId: string }[] {
  const raw = formData.get("pending_images");
  if (!raw) return [];
  try {
    const parsed = pendingImageSchema.safeParse(JSON.parse(raw.toString()));
    return parsed.success ? parsed.data : [];
  } catch {
    return [];
  }
}
