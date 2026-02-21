import { ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "alt"> {
  /** Alt text is mandatory for accessibility and SEO */
  alt: string;
  /** Set to true for above-the-fold hero/critical images */
  priority?: boolean;
  /** Explicit width for CLS prevention */
  width?: number | string;
  /** Explicit height for CLS prevention */
  height?: number | string;
}

/**
 * SEO-optimized image component.
 * - Native lazy loading by default (no third-party observers)
 * - Explicit width/height to prevent layout shifts (CLS)
 * - priority prop for above-the-fold images (eager loading + high fetchPriority)
 */
const OptimizedImage = ({
  alt,
  priority = false,
  className,
  width,
  height,
  style,
  ...props
}: OptimizedImageProps) => {
  return (
    <img
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      {...(priority ? { fetchPriority: "high" as const } : {})}
      width={width}
      height={height}
      className={cn(className)}
      style={{
        ...style,
        ...(width && height ? {} : {}),
      }}
      {...props}
    />
  );
};

export default OptimizedImage;
