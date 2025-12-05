import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface AgentImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
  aspectRatio?: "square" | "portrait" | "auto";
  onLoad?: () => void;
  onClick?: () => void;
}

export const AgentImage = ({
  src,
  alt,
  className,
  containerClassName,
  priority = false,
  aspectRatio = "auto",
  onLoad,
  onClick,
}: AgentImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const aspectClasses = {
    square: "aspect-square",
    portrait: "aspect-[3/4]",
    auto: "",
  };

  return (
    <div className={cn("relative", aspectClasses[aspectRatio], containerClassName)}>
      {/* Skeleton placeholder */}
      {!isLoaded && (
        <Skeleton 
          className="absolute inset-0 bg-white/10 animate-pulse" 
        />
      )}
      
      {/* Actual image */}
      <img
        src={src}
        alt={alt}
        className={cn(
          "transition-opacity duration-500",
          isLoaded ? "opacity-100" : "opacity-0",
          className
        )}
        onLoad={handleLoad}
        onClick={onClick}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
      />
    </div>
  );
};

// Smaller variant for avatars/thumbnails
interface AgentAvatarProps {
  src: string;
  alt: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const AgentAvatar = ({
  src,
  alt,
  className,
  size = "md",
}: AgentAvatarProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div className={cn("relative rounded-full overflow-hidden", sizeClasses[size], className)}>
      {!isLoaded && (
        <Skeleton className="absolute inset-0 rounded-full bg-white/10" />
      )}
      <img
        src={src}
        alt={alt}
        className={cn(
          "w-full h-full object-cover object-top scale-150 translate-y-2 transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        onLoad={() => setIsLoaded(true)}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
};
