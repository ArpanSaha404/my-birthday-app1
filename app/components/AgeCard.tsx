"use client";

import { useEffect, useRef, useState } from "react";

interface AgeCardProps {
  age: number;
  birthDate: string;
  gif: string;
  shiningText: string;
}

function useCountUp(target: number, duration: number, start: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration, start]);

  return count;
}

export default function AgeCard({ age, birthDate, gif, shiningText }: AgeCardProps) {
  const [visible, setVisible] = useState(false);
  const [targetDays, setTargetDays] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const birth = new Date(birthDate);
    const today = new Date();
    const diffTime = today.getTime() - birth.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    setTargetDays(diffDays);
  }, [birthDate]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const animatedAge = useCountUp(age, 1500, visible);
  const animatedDays = useCountUp(targetDays, 2500, visible);

  return (
    <section ref={sectionRef} className="py-16 px-6">
      <div
        className={`max-w-sm mx-auto transition-all duration-1000 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 border border-amber-200 dark:border-amber-800 text-center overflow-hidden relative">
          {/* Sparkle decorations */}
          <div className="absolute top-3 left-4 text-xl animate-pulse">✨</div>
          <div className="absolute top-3 right-4 text-xl animate-pulse" style={{ animationDelay: "0.5s" }}>✨</div>

          {/* Age headline */}
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            You turned <span className="text-4xl font-extrabold text-orange-600 dark:text-orange-400">{animatedAge}</span> today 🎂
          </h3>

          {/* Days alive */}
          <p className="text-gray-700 dark:text-gray-200 text-base font-medium mt-4">
            {shiningText}
          </p>
          <p className="text-3xl font-bold mt-2 text-rose-600 dark:text-rose-400">
            {animatedDays.toLocaleString()} days ☀️
          </p>

          {/* GIF */}
          <div className="relative w-44 h-44 mx-auto mt-6 rounded-2xl overflow-hidden">
            <img
              src={gif}
              alt="Celebration"
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>

          {/* Bottom decoration */}
          <div className="flex justify-center gap-1 mt-5 text-lg">
            <span>🌟</span>
            <span>💫</span>
            <span>⭐</span>
            <span>💫</span>
            <span>🌟</span>
          </div>
        </div>
      </div>
    </section>
  );
}
