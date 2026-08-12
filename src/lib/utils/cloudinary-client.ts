import type { UploadSignature } from "@/app/admin/(protected)/upload-actions";

export type CloudinaryUploadResult = {
  url: string;
  publicId: string;
};

// Upload thẳng từ trình duyệt lên Cloudinary bằng signature đã ký phía
// server - ảnh không đi qua server Next.js.
export async function uploadToCloudinary(
  file: File,
  signature: UploadSignature,
): Promise<CloudinaryUploadResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", signature.apiKey);
  formData.append("timestamp", String(signature.timestamp));
  formData.append("signature", signature.signature);
  formData.append("folder", signature.folder);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Upload ảnh thất bại.");
  }

  const data = (await res.json()) as { secure_url: string; public_id: string };
  return { url: data.secure_url, publicId: data.public_id };
}
