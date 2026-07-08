"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  caption: string;
}

interface PhotoGalleryProps {
  photos: GalleryItem[];
}

export default function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = Number(entry.target.getAttribute("data-id"));
            setVisibleItems((prev) => new Set(prev).add(id));
          }
        });
      },
      { threshold: 0.2 }
    );

    const items = containerRef.current?.querySelectorAll("[data-id]");
    items?.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [photos]);

  return (
    <section className="py-20 px-6">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
        Celebrating You 📸
      </h2>
      <div
        ref={containerRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
      >
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            data-id={photo.id}
            className={`group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-700 ${
              visibleItems.has(photo.id)
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <div className="aspect-square relative bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = "flex";
                }}
              />
              {/* Placeholder when image doesn't load */}
              <div className="absolute inset-0 items-center justify-center text-4xl hidden">
                💕
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <p className="text-white text-sm font-medium">{photo.caption}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
