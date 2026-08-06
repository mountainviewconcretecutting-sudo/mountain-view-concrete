"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { ImageOff } from "lucide-react";

interface ImageWithFallbackProps extends Omit<ImageProps, "onError"> {
  fallbackText?: string;
  iconSize?: number;
}

export default function ImageWithFallback({
  src,
  alt,
  fallbackText,
  iconSize = 28,
  className,
  ...props
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-steel-light/20 text-steel">
        <ImageOff size={iconSize} className="text-steel-light" aria-hidden="true" />
        {fallbackText && <span className="mt-1 text-xs">{fallbackText}</span>}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
}
