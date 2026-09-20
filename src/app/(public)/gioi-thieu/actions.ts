"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Vui lòng nhập họ tên."),
  phone: z.string().trim().min(8, "Số điện thoại không hợp lệ."),
  message: z.string().trim().min(5, "Vui lòng nhập nội dung cần tư vấn."),
});

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: Partial<Record<"name" | "phone" | "message", string>>;
};

export async function submitContactMessage(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return {
      status: "error",
      message: "Vui lòng kiểm tra lại thông tin.",
      fieldErrors: {
        name: fieldErrors.name?.[0],
        phone: fieldErrors.phone?.[0],
        message: fieldErrors.message?.[0],
      },
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").insert({
    name: parsed.data.name,
    phone: parsed.data.phone,
    message: parsed.data.message,
  });

  if (error) {
    console.error("[contact] failed to save message", error);
    return {
      status: "error",
      message: "Có lỗi xảy ra, vui lòng gọi điện hoặc nhắn Zalo trực tiếp cho chúng tôi.",
    };
  }

  return {
    status: "success",
    message: "Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.",
  };
}
