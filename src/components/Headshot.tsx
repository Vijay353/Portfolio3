import Image from "next/image";
import { site } from "@/content/site";
import { resolvePublicImage } from "@/lib/assets";
import { cn } from "@/lib/cn";
import { ReviewNote } from "./ReviewNote";

/**
 * Headshot with a quiet monogram fallback when no supported image is present.
 * The frame has fixed dimensions, so there is no layout shift either way.
 */
export function Headshot({ className, sizes, preload = false }: { className?: string; sizes: string; preload?: boolean }) {
  const imageSrc = resolvePublicImage(site.headshot.src);
  return (
    <div className={cn("relative overflow-hidden bg-accent-soft", className)}>
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt={site.headshot.alt}
          fill
          sizes={sizes}
          preload={preload}
          className="object-cover"
        />
      ) : (
        <div className="flex size-full flex-col items-center justify-center gap-2">
          <span aria-hidden className="font-serif text-[2.5em] font-semibold text-accent">
            {site.initials}
          </span>
          <span className="absolute bottom-2 left-2 right-2 text-center leading-none">
            <ReviewNote kind="pending">Add headshot.jpg</ReviewNote>
          </span>
        </div>
      )}
    </div>
  );
}
