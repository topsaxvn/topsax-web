"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

type ProductImage = { url: string; alt_text: string | null };

export function ProductThumbLightbox({ images, name }: { images: ProductImage[]; name: string }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, images.length]);

  if (images.length === 0) {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-paper-soft text-xs text-muted">
        —
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setIndex(0);
          setOpen(true);
        }}
        className="relative h-10 w-10 shrink-0 cursor-zoom-in overflow-hidden rounded-lg border border-border"
      >
        <Image src={images[0].url} alt={images[0].alt_text ?? name} fill sizes="40px" className="object-cover" />
      </button>

      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4"
            onClick={() => setOpen(false)}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
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
                  setIndex((i) => (i - 1 + images.length) % images.length);
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 text-3xl text-white/80 hover:text-white sm:left-4"
                aria-label="Ảnh trước"
              >
                ‹
              </button>
            )}

            <div
              className="relative h-[80vh] w-[90vw] sm:w-[80vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[index].url}
                alt={images[index].alt_text ?? name}
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
                  setIndex((i) => (i + 1) % images.length);
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
                      setIndex(i);
                    }}
                    aria-label={`Ảnh ${i + 1}`}
                    className={`h-2 w-2 rounded-full ${i === index ? "bg-white" : "bg-white/40"}`}
                  />
                ))}
              </div>
            )}
          </div>,
          document.body,
        )}
    </>
  );
}
