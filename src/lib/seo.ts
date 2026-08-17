import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import type { ProductDetail } from "@/data-access/products";
import type { PostSummary } from "@/data-access/posts";

export function absoluteUrl(path: string): string {
  return `${siteConfig.url}${path}`;
}

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
      images: image ? [{ url: image, alt: product.images[0]?.alt_text ?? product.name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
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
      images: post.thumbnail_url ? [{ url: post.thumbnail_url }] : undefined,
      publishedTime: post.published_at ?? undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.thumbnail_url ? [post.thumbnail_url] : undefined,
    },
  };
}

const conditionSchema: Record<ProductDetail["condition"], string> = {
  new: "https://schema.org/NewCondition",
  used: "https://schema.org/UsedCondition",
  like_new: "https://schema.org/UsedCondition",
  refurbished: "https://schema.org/RefurbishedCondition",
};

export function productJsonLd(product: ProductDetail, path: string) {
  const url = absoluteUrl(path);
  // Giá 0đ là quy ước "chưa định giá/liên hệ" nội bộ, không phải giá bán
  // thật - không đưa vào Offer structured data để tránh Google hiểu nhầm
  // là hàng miễn phí (xem thêm priceLabel() trong lib/utils/format.ts).
  const hasRealPrice = product.price > 0;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.meta_description ?? product.short_description ?? product.description ?? undefined,
    sku: product.sku ?? undefined,
    image: product.images.map((img) => img.url),
    brand: product.brand ? { "@type": "Brand", name: product.brand.name } : undefined,
    offers: hasRealPrice
      ? {
          "@type": "Offer",
          url,
          priceCurrency: product.currency,
          price: product.price,
          availability: product.status === "available" ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
          itemCondition: conditionSchema[product.condition],
        }
      : undefined,
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
