import Image from "next/image";
import { cn } from "@/lib/utils";

interface PhotoProps {
  src: string;
  alt: string;
  /** Container classes: sizing, radius, border. */
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Skip next/image's re-optimization -- for CMS-served renditions (already cropped server-side by Wagtail's ImageRenditionField, so re-processing is redundant) and for any host next/image's built-in SSRF guard would otherwise reject (a locally-hosted CMS on a private IP, in dev). */
  unoptimized?: boolean;
  children?: React.ReactNode;
}

/**
 * Duotone photograph. The treatment lives in `.photo` (globals.css) so every
 * image on the site maps to the same rust-ink / warm-paper set.
 */
export function Photo({ src, alt, className, sizes, priority, unoptimized, children }: PhotoProps) {
  return (
    <div className={cn("photo", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        unoptimized={unoptimized}
        sizes={sizes ?? "100vw"}
        className="object-cover"
      />
      {children}
    </div>
  );
}
