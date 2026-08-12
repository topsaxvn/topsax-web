import { createHash } from "crypto";

// Chỉ import từ Server Action/Server Component - dùng CLOUDINARY_API_SECRET
// nên không bao giờ được đưa vào bundle client.
function env(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Thiếu biến môi trường ${name}.`);
  return value;
}

export function getCloudinaryPublicConfig() {
  return {
    cloudName: env("CLOUDINARY_CLOUD_NAME"),
    apiKey: env("CLOUDINARY_API_KEY"),
  };
}

function signParams(params: Record<string, string | number>): string {
  const apiSecret = env("CLOUDINARY_API_SECRET");
  const toSign = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  return createHash("sha1").update(`${toSign}${apiSecret}`).digest("hex");
}

export function signUploadParams(params: Record<string, string | number>) {
  return signParams(params);
}

export async function destroyCloudinaryAsset(publicId: string): Promise<void> {
  const { cloudName, apiKey } = getCloudinaryPublicConfig();
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = signParams({ public_id: publicId, timestamp });

  const body = new URLSearchParams({
    public_id: publicId,
    timestamp: String(timestamp),
    api_key: apiKey,
    signature,
  });

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) {
    throw new Error(`Không thể xoá ảnh trên Cloudinary (public_id: ${publicId}).`);
  }
}
