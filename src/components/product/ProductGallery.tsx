"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";

type ProductImage = { url: string; alt_text: string | null };

function altFor(image: ProductImage, name: string, index: number): string {
  return image.alt_text ?? `${name} – ảnh ${index + 1}`;
}

export function ProductGallery({
  images,
  name,
  isSold,
}: {
  images: ProductImage[];
  name: string;
  isSold: boolean;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowRight") setActiveIndex((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft") setActiveIndex((i) => (i - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, images.length]);

  if (images.length === 0) {
    return (
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-paper-soft">
        <div className="flex h-full items-center justify-center text-sm text-muted">Chưa có ảnh</div>
      </div>
    );
  }

  const active = images[activeIndex];

  return (
    <div>
      <button
        type="button"
        onClick={() => setLightboxOpen(true)}
        className="relative block aspect-square w-full cursor-zoom-in overflow-hidden rounded-2xl border border-border bg-paper-soft"
      >
        <Image
          src={active.url}
          alt={altFor(active, name, activeIndex)}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
          priority
        />
        {isSold && (
          <span className="absolute left-4 top-4 rounded-full bg-ink px-3 py-1 text-xs font-semibold text-paper">
            Đã bán
          </span>
        )}
      </button>

      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3">
          {images.map((image, index) => (
            <button
              key={image.url + index}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Xem ảnh ${index + 1}`}
              aria-current={index === activeIndex}
              className={cn(
                "relative aspect-square overflow-hidden rounded-xl border bg-paper-soft transition-colors",
                index === activeIndex ? "border-brass-deep" : "border-border hover:border-brass-deep/50",
              )}
            >
              <Image
                src={image.url}
                alt={altFor(image, name, index)}
                fill
                sizes="12vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {lightboxOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="absolute right-4 top-4 text-2xl text-white/80 hover:text-white"
              aria-label="Đóng"
            >
              ✕
            </button>

            {images.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex((i) => (i - 1 + images.length) % images.length);
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 text-3xl text-white/80 hover:text-white sm:left-4"
                aria-label="Ảnh trước"
              >
                ‹
              </button>
            )}

            <div className="relative h-[80vh] w-[90vw] sm:w-[80vw]" onClick={(e) => e.stopPropagation()}>
              <Image
                src={active.url}
                alt={altFor(active, name, activeIndex)}
                fill
                sizes="90vw"
                className="object-contain"
                priority
              />
            </div>

            {images.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex((i) => (i + 1) % images.length);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-3xl text-white/80 hover:text-white sm:right-4"
                aria-label="Ảnh sau"
              >
                ›
              </button>
            )}

            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveIndex(i);
                    }}
                    aria-label={`Ảnh ${i + 1}`}
                    className={cn("h-2 w-2 rounded-full", i === activeIndex ? "bg-white" : "bg-white/40")}
                  />
                ))}
              </div>
            )}
          </div>,
          document.body,
        )}
    </div>
  );
}
