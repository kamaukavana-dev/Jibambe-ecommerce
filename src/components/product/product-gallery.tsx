'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

/**
 * PDP image gallery with thumbnail selection and hover-zoom on the main image.
 * The main image is `priority` (PDP LCP). Zoom is a CSS transform driven by the
 * pointer position — it degrades gracefully (no zoom) for touch/keyboard, where
 * the full image is already visible. Thumbnails are a proper radio-style list.
 */
export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });

  const src = images[active] ?? images[0] ?? '';

  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row">
      {/* Thumbnails */}
      {images.length > 1 && (
        <div
          className="flex gap-3 sm:flex-col"
          role="tablist"
          aria-label={`${name} images`}
        >
          {images.map((image, i) => (
            <button
              key={image}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`View image ${i + 1}`}
              onClick={() => setActive(i)}
              className={cn(
                'relative h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 transition-colors duration-micro sm:h-20 sm:w-20',
                i === active ? 'border-accent' : 'border-transparent hover:border-border-strong',
              )}
            >
              <Image src={image} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Main image */}
      <div
        className="relative aspect-square flex-1 cursor-zoom-in overflow-hidden rounded-xl bg-surface-sunken"
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setOrigin({
            x: ((e.clientX - r.left) / r.width) * 100,
            y: ((e.clientY - r.top) / r.height) * 100,
          });
        }}
      >
        <Image
          src={src}
          alt={name}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-transform duration-overlay ease-standard"
          style={{
            transform: zoom ? 'scale(1.6)' : 'scale(1)',
            transformOrigin: `${origin.x}% ${origin.y}%`,
          }}
        />
      </div>
    </div>
  );
}
