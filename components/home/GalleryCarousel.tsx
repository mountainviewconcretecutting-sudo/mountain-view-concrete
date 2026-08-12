"use client";

import { useState, useRef, type TouchEvent } from "react";
import { ChevronLeft, ChevronRight, Camera } from "lucide-react";
import ImageWithFallback from "@/components/ImageWithFallback";
import type { GalleryImage } from "@/lib/types";

interface GalleryCarouselProps {
  images: GalleryImage[];
}

export default function GalleryCarousel({ images }: GalleryCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // If no images exist, hide the section gracefully
  if (!images || images.length === 0) {
    return null;
  }

  const total = images.length;

  function nextSlide() {
    setActiveIndex((prev) => (prev + 1) % total);
  }

  function prevSlide() {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }

  function goToSlide(index: number) {
    setActiveIndex(index);
  }

  // Touch Swipe Handlers for mobile responsiveness
  function handleTouchStart(e: TouchEvent) {
    touchEndX.current = null;
    const touch = e.targetTouches[0];
    if (touch) {
      touchStartX.current = touch.clientX;
    }
  }

  function handleTouchMove(e: TouchEvent) {
    const touch = e.targetTouches[0];
    if (touch) {
      touchEndX.current = touch.clientX;
    }
  }

  function handleTouchEnd() {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 40; // px threshold

    if (distance > minSwipeDistance) {
      // Swiped left -> next
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      // Swiped right -> prev
      prevSlide();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  }

  return (
    <section className="relative border-b-2 border-slurry/40 bg-aggregate-deep py-16 text-chalk md:py-20">
      <div className="container-page">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 gap-4">
          <div>
            <span className="font-tech text-xs font-bold uppercase tracking-[0.25em] text-flame flex items-center gap-2">
              <Camera size={14} aria-hidden="true" />
              {"// ON-SITE PHOTO WALL"}
            </span>
            <h2 className="mt-1 font-display text-3xl uppercase tracking-wide text-chalk md:text-4xl">
              PROJECT &amp; FIELD GALLERY
            </h2>
          </div>

          {/* Counter Badge & Navigation Buttons (Desktop & Tablet) */}
          <div className="flex items-center gap-4">
            <span className="font-tech text-xs font-bold uppercase tracking-wider text-steel-light border border-slurry/50 bg-aggregate px-3 py-1.5">
              IMAGE {activeIndex + 1} OF {total}
            </span>
            <div className="flex items-center gap-2">
              {/* Minimum 44x44px tap area buttons */}
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous slide"
                className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center border-2 border-slurry/50 bg-aggregate text-chalk shadow-[3px_3px_0px_#0F1115] transition-colors hover:border-flame hover:text-flame focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-flame"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next slide"
                className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center border-2 border-slurry/50 bg-aggregate text-chalk shadow-[3px_3px_0px_#0F1115] transition-colors hover:border-flame hover:text-flame focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-flame"
              >
                <ChevronRight size={22} />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Frame & Track with Touch Handlers */}
        <div
          className="relative overflow-hidden border-2 border-slurry/60 bg-aggregate shadow-[3px_3px_0px_#0F1115] md:shadow-[6px_6px_0px_#0F1115]"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {images.map((img, idx) => {
              // Eager load only current slide and immediate neighbors (idx - 1, idx + 1)
              const isNear =
                Math.abs(idx - activeIndex) <= 1 ||
                (activeIndex === 0 && idx === total - 1) ||
                (activeIndex === total - 1 && idx === 0);

              return (
                <div
                  key={img.id}
                  className="w-full flex-shrink-0 relative h-[320px] sm:h-[450px] md:h-[550px] bg-slurry/30"
                >
                  <ImageWithFallback
                    src={img.image_url}
                    alt={img.alt_text || `Gallery image ${idx + 1}`}
                    fill
                    sizes="100vw"
                    priority={idx === activeIndex}
                    loading={isNear ? "eager" : "lazy"}
                    className="object-cover"
                  />

                  {/* Alt Text Overlay Badge */}
                  {img.alt_text && (
                    <div className="absolute bottom-0 left-0 right-0 bg-aggregate-deep/90 border-t border-slurry/50 p-4 backdrop-blur-xs">
                      <p className="font-tech text-xs uppercase tracking-wider text-steel-light font-bold">
                        {img.alt_text}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Dots Indicator */}
        {total > 1 && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {images.map((img, idx) => (
              <button
                key={img.id}
                type="button"
                onClick={() => goToSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-3 transition-all ${
                  idx === activeIndex
                    ? "w-8 bg-flame border border-flame"
                    : "w-3 bg-slurry/60 hover:bg-steel-light border border-transparent"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
