"use client";

import { useEffect, useState } from "react";

interface BirthdayCardProps {
  quote: string;
  gif: string;
}

export default function BirthdayCard({ quote, gif }: BirthdayCardProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-16 pb-[50vh] sm:pb-16 px-6" id="birthday-card-section">
      <div
        className={`max-w-sm mx-auto transition-all duration-1000 ${
          visible ? "opacity-100 scale-100" : "opacity-0 scale-90"
        }`}
      >
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-6 border border-pink-200 dark:border-pink-800 text-center overflow-hidden">
          {/* GIF */}
          <div className="relative w-48 h-48 mx-auto mb-6 rounded-2xl overflow-hidden bg-pink-50 dark:bg-gray-800">
            <img
              src={gif}
              alt="Birthday celebration"
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>

          {/* Quote */}
          <p className="text-gray-900 dark:text-white text-lg font-semibold italic leading-relaxed px-2">
            &ldquo;{quote}&rdquo;
          </p>

          {/* Decorative hearts */}
          <div className="flex justify-center gap-2 mt-4 text-2xl">
            <span className="animate-bounce" style={{ animationDelay: "0s" }}>💖</span>
            <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>💗</span>
            <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>💖</span>
          </div>
        </div>
      </div>
    </section>
  );
}
