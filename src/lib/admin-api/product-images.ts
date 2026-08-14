import { createClient } from "@/lib/supabase/client";
import { destroyUnattachedImage } from "@/app/admin/(protected)/upload-actions";
import type { ProductImageRow } from "@/data-access/products";

const supabase = createClient();

export const productImagesApi = {
  async list(productId: string): Promise<ProductImageRow[]> {
    const { data, error } = await supabase
      .from("product_images")
      .select("*")
      .eq("product_id", productId)
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return data;
  },

  async attach(productId: string, image: { url: string; publicId: string; altText: string | null }): Promise<void> {
    const { count } = await supabase
      .from("product_images")
      .select("*", { count: "exact", head: true })
      .eq("product_id", productId);

    const { error } = await supabase.from("product_images").insert({
      product_id: productId,
      url: image.url,
      public_id: image.publicId,
      alt_text: image.altText,
      sort_order: count ?? 0,
      is_thumbnail: (count ?? 0) === 0,
    });
    if (error) throw new Error("Không thể lưu ảnh vào cơ sở dữ liệu.");
  },

  async remove(imageId: string, publicId: string, productId: string): Promise<void> {
    const { data: image } = await supabase
      .from("product_images")
      .select("is_thumbnail")
      .eq("id", imageId)
      .maybeSingle();

    await supabase.from("product_images").delete().eq("id", imageId);

    if (image?.is_thumbnail) {
      const { data: remaining } = await supabase
        .from("product_images")
        .select("id")
        .eq("product_id", productId)
        .order("sort_order", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (remaining) {
        await supabase.from("product_images").update({ is_thumbnail: true }).eq("id", remaining.id);
      }
    }

    try {
      // destroyUnattachedImage chỉ là tên gọi cũ (ban đầu viết cho ảnh chưa
      // gắn sản phẩm) - về bản chất chỉ gọi destroyCloudinaryAsset phía
      // server (cần CLOUDINARY_API_SECRET), dùng lại được cho cả trường hợp
      // xoá ảnh đã gắn vào sản phẩm.
      await destroyUnattachedImage(publicId);
    } catch {
      // Ảnh trong DB đã xoá; lỗi xoá trên Cloudinary không nên chặn luồng admin.
    }
  },

  async setThumbnail(productId: string, imageId: string): Promise<void> {
    // Thứ tự bắt buộc: unset tất cả rồi mới set 1 cái - DB có unique partial
    // index chỉ cho phép 1 is_thumbnail=true / product, đảo thứ tự sẽ lỗi.
    await supabase.from("product_images").update({ is_thumbnail: false }).eq("product_id", productId);
    const { error } = await supabase.from("product_images").update({ is_thumbnail: true }).eq("id", imageId);
    if (error) throw new Error(error.message);
  },

  async reorder(orderedIds: string[]): Promise<void> {
    await Promise.all(
      orderedIds.map((id, index) => supabase.from("product_images").update({ sort_order: index }).eq("id", id)),
    );
  },
};
