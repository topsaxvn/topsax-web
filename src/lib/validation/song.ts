import { z } from "zod";

const songWordSchema = z.object({
  text: z.string(),
  note: z.number().nullable().optional(),
  slur: z.array(z.number()).nullable().optional(),
});

export const songLinesSchema = z.array(z.array(songWordSchema));

export const songSchema = z.object({
  title: z.string().trim().min(1, "Tên bài hát bắt buộc."),
  slug: z
    .string()
    .trim()
    .min(1, "Slug bắt buộc.")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug chỉ gồm chữ thường, số và dấu -."),
  singer: z.string().trim(),
  // DB đang lưu "" (không phải null) cho bài chưa có mô tả.
  description: z.string().trim(),
  song_key: z.number().int().min(0).max(11),
  song_key_mode: z.enum(["major", "minor"]),
  scale_root: z.number().int().min(0).max(11),
  scale_type: z.string().trim().min(1),
  instrument: z.string().trim().min(1),
  naming: z.enum(["letter", "solfege"]),
  published: z.boolean(),
  lines: songLinesSchema,
});

export type SongFormValues = z.infer<typeof songSchema>;
