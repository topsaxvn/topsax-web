"use server";

import { createClient } from "@/lib/supabase/server";
import { destroyCloudinaryAsset, getCloudinaryPublicConfig, signUploadParams } from "@/lib/cloudinary";

export type UploadSignature = {
  timestamp: number;
  signature: string;
  apiKey: string;
  cloudName: string;
  folder: string;
};

const allowedFolders = ["saxophone/products", "saxophone/blog"] as const;
type AllowedFolder = (typeof allowedFolders)[number];

// Ký tham số upload phía server (cần CLOUDINARY_API_SECRET) rồi trả về cho
// client để upload thẳng lên Cloudinary - ảnh không đi qua server của mình.
export async function getUploadSignature(folder: AllowedFolder): Promise<UploadSignature> {
  if (!allowedFolders.includes(folder)) {
    throw new Error("Thư mục upload không hợp lệ.");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Bạn cần đăng nhập để upload ảnh.");

  const timestamp = Math.floor(Date.now() / 1000);
  const signature = signUploadParams({ folder, timestamp });
  const { cloudName, apiKey } = getCloudinaryPublicConfig();

  return { timestamp, signature, apiKey, cloudName, folder };
}

// Xoá ảnh đã upload lên Cloudinary nhưng chưa gắn vào sản phẩm nào trong DB -
// dùng khi admin bỏ ảnh ra khỏi form tạo sản phẩm mới trước khi submit.
export async function destroyUnattachedImage(publicId: string): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Bạn cần đăng nhập để thực hiện thao tác này.");

  await destroyCloudinaryAsset(publicId);
}
