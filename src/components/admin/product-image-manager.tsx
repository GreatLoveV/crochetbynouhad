"use client";

import { useState, useTransition } from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  Loader2Icon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  addProductImage,
  moveProductImage,
  removeProductImage,
} from "@/app/admin/actions/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { strings } from "@/lib/constants/strings";

type ImageRow = { id: number; url: string; position: number };

/**
 * Gallery editor: add by link, remove, reorder.
 *
 * Plain forms calling Server Actions directly — no state machine needed, and
 * the browser shows the result after the automatic refresh.
 */
export function ProductImageManager({
  productId,
  images,
}: {
  productId: number;
  images: ImageRow[];
}) {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [pending, startTransition] = useTransition();

  function add() {
    const trimmed = url.trim();
    if (!trimmed) return;
    const data = new FormData();
    data.set("id", String(productId));
    data.set("url", trimmed);
    setUrl("");
    startTransition(async () => {
      await addProductImage(data);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Input
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder={strings.admin.imageUrlPlaceholder}
          aria-label={strings.admin.imageUrl}
          disabled={pending}
        />
        <Button
          type="button"
          variant="outline"
          onClick={add}
          disabled={pending || url.trim().length === 0}
        >
          {pending ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            <PlusIcon />
          )}
          {strings.admin.addImage}
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        {strings.admin.firstImageHint}
      </p>

      {images.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {strings.admin.noImages}
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {images.map((image, index) => (
            <li
              key={image.id}
              className="flex items-center gap-3 rounded-xl border border-border p-2"
            >
              <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                <Image
                  src={image.url}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-cover"
                  // Admin previews must not fail on hosts the shop has not been
                  // told about yet.
                  unoptimized
                />
              </div>

              <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
                {image.url}
              </span>

              <div className="flex shrink-0 gap-1">
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  disabled={pending || index === 0}
                  onClick={() => move(image.id, "up")}
                  aria-label="Monter la photo"
                >
                  <ArrowUpIcon />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  disabled={pending || index === images.length - 1}
                  onClick={() => move(image.id, "down")}
                  aria-label="Descendre la photo"
                >
                  <ArrowDownIcon />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  disabled={pending}
                  onClick={() => drop(image.id)}
                  aria-label={strings.admin.removeImage}
                >
                  <Trash2Icon />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  function move(imageId: number, direction: "up" | "down") {
    const data = new FormData();
    data.set("imageId", String(imageId));
    data.set("direction", direction);
    startTransition(async () => {
      await moveProductImage(data);
      router.refresh();
    });
  }

  function drop(imageId: number) {
    const data = new FormData();
    data.set("imageId", String(imageId));
    startTransition(async () => {
      await removeProductImage(data);
      router.refresh();
    });
  }
}