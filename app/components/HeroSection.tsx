"use client";

import { useEffect, useState } from "react";

interface HeroSectionProps {
  recipientName: string;
  heroTitle: string;
  heroSubtitle: string;
}

export default function HeroSection({ recipientName, heroTitle, heroSubtitle }: HeroSectionProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-pink-300/20 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-rose-200/10 rounded-full blur-2xl animate-pulse" />
      </div>

      <div
        className={`relative z-10 transition-all duration-1000 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <p className="text-lg md:text-xl text-rose-400 font-light mb-4 tracking-wider uppercase">
          🎂 {heroSubtitle} 🎂
        </p>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 bg-clip-text text-transparent leading-tight">
          {heroTitle}
        </h1>
        <p className="text-3xl md:text-5xl mt-6 font-light text-gray-700 dark:text-gray-200">
          {recipientName} 🎉
        </p>
        <div
          className="mt-10 animate-bounce cursor-pointer"
          onClick={() => {
            const nextSection = document.getElementById("birthday-card-section");
            nextSection?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <svg
            className="w-8 h-8 mx-auto text-rose-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
