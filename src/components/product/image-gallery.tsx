"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "cn";

import { Photo } from "@/components/ui/photo";
import { fill } from "@/i18n/config";
import { useI18n } from "@/i18n/client";
import { isOptimizableImageUrl } from "@/lib/constants/images";

/**
 * Product photos: one large photo, and the others as thumbnails. On a large
 * screen the thumbnails stand in a column on the inline start (left in
 * French, right in Arabic); on a phone they sit in a row under the photo.
 *
 * Changing photo is a 200 ms crossfade. The list arrives sorted by
 * `position`, so [0] is the main photo.
 */
export function ImageGallery({
  images,
  alt,
  altLang,
}: {
  images: { url: string; position: number }[];
  alt: string;
  altLang?: string;
}) {
  const { t } = useI18n();
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return <Photo alt={alt} emptyLabel={alt} emptyLabelLang={altLang} priority />;
  }

  const active = images[activeIndex];

  return (
    <div className="flex flex-col gap-3 lg:flex-row-reverse lg:items-start lg:gap-4">
      <div className="relative aspect-4/5 w-full overflow-hidden bg-lin lg:flex-1">
        <Image
          // A new key remounts the image, which replays the fade.
          key={active.url}
          src={active.url}
          alt={alt}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="animate-in fade-in-0 object-cover duration-200 ease-thread"
          unoptimized={!isOptimizableImageUrl(active.url)}
        />
      </div>

      {images.length > 1 ? (
        <ul className="flex gap-2 overflow-x-auto no-scrollbar lg:w-20 lg:flex-col lg:overflow-visible">
          {images.map((image, index) => (
            <li key={image.url} className="shrink-0">
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-current={index === activeIndex}
                aria-label={fill(t.product.viewPhoto, { n: index + 1 })}
                className={cn(
                  "relative block aspect-4/5 w-16 overflow-hidden bg-lin outline-offset-2 lg:w-20",
                  index === activeIndex ? "outline-1 outline-encre outline-solid" : "hover:outline-1 hover:outline-trait hover:outline-solid",
                )}
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
