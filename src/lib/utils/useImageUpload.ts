"use client";

import { useState } from "react";
import { getUploadSignature } from "@/app/admin/(protected)/upload-actions";
import { uploadToCloudinary, type CloudinaryUploadResult } from "@/lib/utils/cloudinary-client";
import { compressImage, findOversizedFile } from "@/lib/utils/image-compress";

type Folder = "saxophone/products" | "saxophone/blog" | "saxophone/brands";

// Gộp logic upload dùng chung cho ImageUploadField/ProductImageManager/
// NewProductImageUpload: kiểm tra dung lượng (tối đa 15MB/ảnh, giống
// sax-stock-manager) trước khi làm gì cả, nén ảnh lớn, rồi mới ký + upload
// thẳng lên Cloudinary. Ký chữ ký vẫn qua Server Action (CLOUDINARY_API_SECRET
// không được lộ ra client).
export function useImageUpload(folder: Folder) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function uploadFiles(files: File[]): Promise<CloudinaryUploadResult[]> {
    if (files.length === 0) return [];

    const tooBig = findOversizedFile(files);
    if (tooBig) {
      setError(`Ảnh "${tooBig.name}" quá lớn (tối đa 15MB)`);
      return [];
    }

    setUploading(true);
    setError(null);
    try {
      const results: CloudinaryUploadResult[] = [];
      for (const file of files) {
        const compressed = await compressImage(file);
        const signature = await getUploadSignature(folder);
        results.push(await uploadToCloudinary(compressed, signature));
      }
      return results;
    } catch {
      setError("Upload ảnh thất bại, vui lòng thử lại.");
      return [];
    } finally {
      setUploading(false);
    }
  }

  return { uploadFiles, uploading, error, setError };
}
