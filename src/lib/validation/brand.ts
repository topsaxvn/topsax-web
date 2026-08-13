import { z } from "zod";
import { emptyToNull } from "@/lib/validation/utils";

export const brandSchema = z.object({
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

export type BrandFormValues = z.infer<typeof brandSchema>;

export function parseBrandForm(formData: FormData) {
  return brandSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: emptyToNull(formData.get("description")),
    logo_url: emptyToNull(formData.get("logo_url")),
    is_active: formData.get("is_active") === "on",
  });
}
