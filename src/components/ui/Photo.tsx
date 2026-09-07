import Image from "next/image";
import { cn } from "@/lib/utils";

interface PhotoProps {
  src: string;
  alt: string;
  /** Container classes: sizing, radius, border. */
  className?: string;
  sizes?: string;
  priority?: boolean;
  children?: React.ReactNode;
}

/**
 * Duotone photograph. The treatment lives in `.photo` (globals.css) so every
 * image on the site maps to the same rust-ink / warm-paper set.
 */
export function Photo({ src, alt, className, sizes, priority, children }: PhotoProps) {
  return (
    <div className={cn("photo", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes ?? "100vw"}
        className="object-cover"
      />
      {children}
    </div>
  );
}
