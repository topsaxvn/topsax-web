import { z } from "zod";
import { emptyToNull } from "@/lib/validation/utils";

export const categorySchema = z.object({
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

export type CategoryFormValues = z.infer<typeof categorySchema>;

export function parseCategoryForm(formData: FormData) {
  return categorySchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: emptyToNull(formData.get("description")),
    parent_id: emptyToNull(formData.get("parent_id")),
    sort_order: (formData.get("sort_order") || "0").toString(),
    is_active: formData.get("is_active") === "on",
  });
}
