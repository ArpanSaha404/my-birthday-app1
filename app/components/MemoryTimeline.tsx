"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface Memory {
  id: number;
  date: string;
  title: string;
  description: string;
  image: string;
}

interface MemoryTimelineProps {
  memories: Memory[];
}

export default function MemoryTimeline({ memories }: MemoryTimelineProps) {
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
      { threshold: 0.3 }
    );

    const items = containerRef.current?.querySelectorAll("[data-id]");
    items?.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [memories]);

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-transparent via-pink-50/50 to-transparent dark:via-pink-950/10">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
        Our Journey Together 💫
      </h2>
      <div ref={containerRef} className="max-w-4xl mx-auto relative">
        {/* Timeline line */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-pink-300 via-rose-400 to-purple-400 md:-translate-x-0.5" />

        {memories.map((memory, index) => {
          const isLeft = index % 2 === 0;
          return (
            <div
              key={memory.id}
              data-id={memory.id}
              className={`relative flex items-center mb-12 ${
                visibleItems.has(memory.id)
                  ? "opacity-100 translate-x-0"
                  : `opacity-0 ${isLeft ? "-translate-x-8" : "translate-x-8"}`
              } transition-all duration-700`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Timeline dot */}
              <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-rose-500 rounded-full border-4 border-white dark:border-gray-900 -translate-x-1.5 md:-translate-x-2 z-10 shadow-lg" />

              {/* Content card */}
              <div
                className={`ml-12 md:ml-0 md:w-[calc(50%-2rem)] ${
                  isLeft ? "md:mr-auto md:pr-8" : "md:ml-auto md:pl-8"
                }`}
              >
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-pink-100 dark:border-pink-900/30">
                  <span className="text-xs font-semibold text-rose-500 uppercase tracking-wider">
                    {memory.date}
                  </span>
                  <h3 className="text-xl font-bold mt-2 text-gray-800 dark:text-gray-100">
                    {memory.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm leading-relaxed">
                    {memory.description}
                  </p>
                  <div className="mt-4 relative h-40 rounded-xl overflow-hidden bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20">
                    <Image
                      src={memory.image}
                      alt={memory.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = "flex";
                      }}
                    />
                    <div className="absolute inset-0 items-center justify-center text-3xl hidden">
                      💕
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
