"use client";

import Image from "next/image";
import { useState } from "react";

import { isOptimizableImageUrl } from "@/lib/constants/images";

/**
 * Product photo gallery: one large image plus a thumbnail strip.
 *
 * Client component because selecting a thumbnail is browser state. The list is
 * already sorted by `position` when it arrives from the database; sorting again
 * here would just hide a bug, so we trust it and keep an index into the array.
 */
export function ImageGallery({
  images,
  alt,
}: {
  images: { url: string; position: number }[];
  alt: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-4/5 w-full items-center justify-center rounded-3xl border border-border/60 bg-muted text-sm text-muted-foreground">
        Photo à venir
      </div>
    );
  }

  const active = images[activeIndex];

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-4/5 w-full overflow-hidden rounded-3xl border border-border/60 bg-card shadow-soft">
        <Image
          // key remounts the image on change, which restarts the fade-in.
          key={active.url}
          src={active.url}
          alt={alt}
          fill
          priority
          sizes="(min-width: 1024px) 45vw, 100vw"
          className="animate-in fade-in-0 object-cover duration-500"
          unoptimized={!isOptimizableImageUrl(active.url)}
        />
      </div>

      {images.length > 1 ? (
        <ul className="flex gap-3 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <li key={image.url}>
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-current={index === activeIndex}
                aria-label={`Voir la photo ${index + 1}`}
                className={
                  index === activeIndex
                    ? "relative block size-20 overflow-hidden rounded-2xl ring-2 ring-primary ring-offset-2 ring-offset-background transition-all duration-300 ease-soft"
                    : "relative block size-20 overflow-hidden rounded-2xl opacity-65 ring-1 ring-border transition-all duration-300 ease-soft hover:opacity-100"
                }
              >
                <Image
                  src={image.url}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                  unoptimized={!isOptimizableImageUrl(image.url)}
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}