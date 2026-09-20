import { z } from "zod";
import { emptyToNull } from "@/lib/validation/utils";

const songWordSchema = z.object({
  text: z.string(),
  note: z.number().nullable().optional(),
  slur: z.array(z.number()).nullable().optional(),
});

const songLinesSchema = z.array(z.array(songWordSchema));

export const songSchema = z.object({
  title: z.string().trim().min(1, "Tên bài hát bắt buộc."),
  slug: z
    .string()
    .trim()
    .min(1, "Slug bắt buộc.")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug chỉ gồm chữ thường, số và dấu -."),
  singer: z.string().trim(),
  description: z.string().trim().nullable(),
  song_key: z.coerce.number().int().min(0).max(11),
  scale_root: z.coerce.number().int().min(0).max(11),
  scale_type: z.string().trim().min(1, "Loại gam bắt buộc."),
  instrument: z.string().trim().min(1, "Nhạc cụ bắt buộc."),
  naming: z.enum(["letter", "solfege"]),
  published: z.boolean(),
  lines: songLinesSchema,
});

export type SongFormValues = z.infer<typeof songSchema>;

// "lines" nhập dưới dạng JSON thô trong textarea - parse riêng trước khi đưa
// vào zod để có thể báo lỗi "JSON không hợp lệ" tách biệt với lỗi cấu trúc.
export function parseSongForm(formData: FormData) {
  let lines: unknown;
  try {
    lines = JSON.parse(formData.get("lines_json")?.toString() ?? "[]");
  } catch {
    return {
      success: false as const,
      error: new z.ZodError([
        { code: "custom", path: ["lines_json"], message: "JSON không hợp lệ." },
      ]),
    };
  }

  return songSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    singer: formData.get("singer") ?? "",
    description: emptyToNull(formData.get("description")),
    song_key: formData.get("song_key"),
    scale_root: formData.get("scale_root"),
    scale_type: formData.get("scale_type"),
    instrument: formData.get("instrument"),
    naming: formData.get("naming"),
    published: formData.get("published") === "on",
    lines,
  });
}
