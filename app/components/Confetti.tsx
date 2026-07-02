"use client";

import { useEffect, useState } from "react";

export default function Confetti() {
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; delay: number; duration: number; color: string; size: number }>
  >([]);

  useEffect(() => {
    const colors = ["#ff6b6b", "#feca57", "#48dbfb", "#ff9ff3", "#54a0ff", "#5f27cd", "#01a3a4", "#f368e0"];
    const newParticles = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 6 + Math.random() * 10,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-confetti-fall"
          style={{
            left: `${p.x}%`,
            top: "-20px",
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
          }}
        />
      ))}
    </div>
  );
}
