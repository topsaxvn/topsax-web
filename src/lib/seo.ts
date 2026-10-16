import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import type { ProductDetail } from "@/data-access/products";
import type { PostSummary } from "@/data-access/posts";
import type { SongDetail } from "@/data-access/songs";
import { lyricsText, songKeyName, toneFor } from "@/lib/music";

export function absoluteUrl(path: string): string {
  return `${siteConfig.url}${path}`;
}

// Next.js chỉ merge metadata giữa các segment theo kiểu shallow: nếu một
// trang tự khai báo `openGraph`, toàn bộ `openGraph` (kể cả `images`) của
// layout cha bị ghi đè chứ không cộng dồn. Vì vậy trang nào không có ảnh
// riêng (sản phẩm/bài viết/cảm âm chưa có thumbnail) đều phải tự set lại
// ảnh mặc định này, nếu không link chia sẻ sẽ mất thumbnail hoàn toàn.
const defaultOgImage = { url: absoluteUrl("/brand/topsax-logo.png"), alt: siteConfig.name };

export function productMetadata(product: ProductDetail, path: string): Metadata {
  const url = absoluteUrl(path);
  const title = product.meta_title ?? product.name;
  const description = product.meta_description ?? product.short_description ?? undefined;
  const image = product.images[0]?.url;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      images: [image ? { url: image, alt: product.images[0]?.alt_text ?? product.name } : defaultOgImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image ?? defaultOgImage.url],
    },
  };
}

export function categoryMetadata(
  category: { name: string; description: string | null },
  path: string,
): Metadata {
  const url = absoluteUrl(path);
  return {
    title: category.name,
    description: category.description ?? undefined,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: category.name,
      description: category.description ?? undefined,
      images: [defaultOgImage],
    },
  };
}

export function postMetadata(post: PostSummary, path: string): Metadata {
  const url = absoluteUrl(path);
  const title = post.meta_title ?? post.title;
  const description = post.meta_description ?? post.excerpt ?? undefined;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title,
      description,
      images: [post.thumbnail_url ? { url: post.thumbnail_url } : defaultOgImage],
      publishedTime: post.published_at ?? undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [post.thumbnail_url ?? defaultOgImage.url],
    },
  };
}

export function songMetadata(song: SongDetail, path: string): Metadata {
  const url = absoluteUrl(path);
  const title = `${song.title}${song.singer ? ` - ${song.singer}` : ""} | Cảm âm`;
  const description = `Cảm âm ${song.title}${song.singer ? ` - ${song.singer}` : ""}: lời bài hát kèm tên nốt, tự chuyển tone theo nhạc cụ.`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title,
      description,
      images: [defaultOgImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [defaultOgImage.url],
    },
  };
}

const conditionSchema: Record<ProductDetail["condition"], string> = {
  new: "https://schema.org/NewCondition",
  used: "https://schema.org/UsedCondition",
  like_new: "https://schema.org/UsedCondition",
  refurbished: "https://schema.org/RefurbishedCondition",
};

// Giá 0đ là quy ước "chưa định giá/liên hệ" nội bộ, không phải giá bán thật
// - không đưa vào Offer để tránh Google hiểu nhầm là hàng miễn phí (xem
// priceLabel() trong lib/utils/format.ts). Google coi Product thiếu cả
// offers/review/aggregateRating là item không hợp lệ (báo lỗi trong Search
// Console), mà review/rating thì không có dữ liệu thật => bỏ hẳn schema
// Product cho sản phẩm chưa có giá, chỉ giữ BreadcrumbList.
export function productJsonLd(product: ProductDetail, path: string) {
  if (product.price <= 0) return null;
  const url = absoluteUrl(path);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.meta_description ?? product.short_description ?? product.description ?? undefined,
    sku: product.sku ?? undefined,
    image: product.images.map((img) => img.url),
    brand: product.brand ? { "@type": "Brand", name: product.brand.name } : undefined,
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: product.currency,
      price: product.price,
      availability: product.status === "available" ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
      itemCondition: conditionSchema[product.condition],
    },
  };
}

export function articleJsonLd(post: PostSummary, path: string) {
  const url = absoluteUrl(path);

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.meta_description ?? post.excerpt ?? undefined,
    image: post.thumbnail_url ? [post.thumbnail_url] : undefined,
    datePublished: post.published_at ?? post.created_at,
    dateModified: post.updated_at,
    author: { "@type": "Organization", name: siteConfig.name },
    publisher: { "@type": "Organization", name: siteConfig.name },
    mainEntityOfPage: url,
  };
}

// LocalBusiness (MusicStore) cho toàn site - chỉ dùng dữ liệu thật có sẵn
// trong siteConfig, không thêm openingHours/rating vì chưa xác thực được.
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "MusicStore",
    name: siteConfig.name,
    url: siteConfig.url,
    image: absoluteUrl("/brand/topsax-logo.png"),
    telephone: siteConfig.phone,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address,
      addressCountry: "VN",
    },
  };
}

// MusicComposition thay vì MusicRecording vì trang chỉ có lời + tên nốt
// (bản ký âm), không có file ghi âm. "singer" trong DB là người thể hiện
// bản ghi âm gốc, không phải tác giả - gán vào recordedAs.byArtist chứ
// không gán vào composer/lyricist để không sai dữ liệu.
export function songJsonLd(song: SongDetail, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "MusicComposition",
    name: song.title,
    url: absoluteUrl(path),
    inLanguage: "vi",
    musicalKey: songKeyName(toneFor(song.song_key, "piano"), song.song_key_mode, "letter"),
    lyrics: song.lines.length > 0 ? { "@type": "CreativeWork", text: lyricsText(song.lines) } : undefined,
    recordedAs: song.singer
      ? { "@type": "MusicRecording", byArtist: { "@type": "Person", name: song.singer } }
      : undefined,
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
