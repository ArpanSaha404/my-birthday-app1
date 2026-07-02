"use client";

import { useEffect, useRef, useState } from "react";

interface FinalCardProps {
  messageLine1: string;
  messageLine2: string;
  gif: string;
}

export default function FinalCard({ messageLine1, messageLine2, gif }: FinalCardProps) {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 px-6">
      <div
        className={`max-w-sm mx-auto transition-all duration-1000 ${
          visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-95"
        }`}
      >
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 border border-purple-200 dark:border-purple-800 text-center overflow-hidden relative">
          {/* Decorative corners */}
          <div className="absolute top-2 left-3 text-lg">🌸</div>
          <div className="absolute top-2 right-3 text-lg">🌸</div>
          <div className="absolute bottom-2 left-3 text-lg">✨</div>
          <div className="absolute bottom-2 right-3 text-lg">✨</div>

          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Happy Birthday! 🥂
          </h3>

          {/* GIF */}
          <div className="w-44 h-44 mx-auto mb-6 rounded-2xl overflow-hidden bg-purple-50 dark:bg-gray-800">
            <img
              src={gif}
              alt="Happy Birthday"
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>

          {/* Message */}
          <p className="text-gray-700 dark:text-gray-200 text-base leading-relaxed font-medium">
            {messageLine1}
          </p>
          <p className="text-gray-700 dark:text-gray-200 text-base leading-relaxed font-medium mt-4">
            {messageLine2}
          </p>

          {/* Cheers emoji */}
          <div className="flex justify-center gap-2 mt-6 text-3xl">
            <span className="animate-bounce" style={{ animationDelay: "0s" }}>🥂</span>
            <span className="animate-bounce" style={{ animationDelay: "0.15s" }}>🎂</span>
            <span className="animate-bounce" style={{ animationDelay: "0.3s" }}>💝</span>
          </div>
        </div>
      </div>
    </section>
  );
}
