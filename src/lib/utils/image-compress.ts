// Nén ảnh ở trình duyệt trước khi upload - resize về tối đa 1920px cạnh dài,
// chất lượng 0.82, chỉ áp dụng cho ảnh >= 400KB (jpeg/png/webp). Ảnh nhỏ hoặc
// định dạng khác giữ nguyên. Port từ sax-stock-manager
// (frontend/src/pages/Products.jsx compressImage()), bỏ bước base64 vì luồng
// upload của dự án này đã nhận thẳng File qua FormData.
export function compressImage(file: File, { maxDim = 1920, quality = 0.82 } = {}): Promise<File> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return Promise.resolve(file);
  if (file.size < 400 * 1024) return Promise.resolve(file);

  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      if (scale === 1) {
        resolve(file);
        return;
      }
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(file);
        return;
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const outType = file.type === "image/png" ? "image/png" : "image/jpeg";
      canvas.toBlob(
        (blob) => resolve(blob ? new File([blob], file.name, { type: outType }) : file),
        outType,
        quality,
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };
    img.src = objectUrl;
  });
}

export const MAX_IMAGE_BYTES = 15 * 1024 * 1024;

export function findOversizedFile(files: File[]): File | undefined {
  return files.find((f) => f.size > MAX_IMAGE_BYTES);
}
