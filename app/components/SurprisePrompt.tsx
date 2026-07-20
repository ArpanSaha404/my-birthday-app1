"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface SurprisePromptProps {
  data: {
    loadingText: string;
    question: string;
    yesText: string;
    yesGif: string;
    noTexts: string[];
    gifs: string[];
  };
  onReady: () => void;
}

export default function SurprisePrompt({ data, onReady }: SurprisePromptProps) {
  const [loading, setLoading] = useState(true);
  const [noIndex, setNoIndex] = useState(0);
  const [noPosition, setNoPosition] = useState<{ x: number; y: number } | null>(null);
  const [noHidden, setNoHidden] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [yesClicked, setYesClicked] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const yesButtonRef = useRef<HTMLButtonElement>(null);
  const gifRef = useRef<HTMLDivElement>(null);

  // Loading phase
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setTimeout(() => setFadeIn(true), 50);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const moveNoButton = useCallback(() => {
    if (!containerRef.current) return;

    // If already at last text, hide the button entirely
    setNoIndex((prev) => {
      if (prev >= data.noTexts.length - 1) {
        setNoHidden(true);
        return prev;
      }
      return prev + 1;
    });

    const container = containerRef.current.getBoundingClientRect();
    const btnW = 200;
    const btnH = 56;
    const safeMargin = 40;

    const maxX = container.width - btnW - safeMargin;
    const maxY = container.height - btnH - safeMargin;

    // Get exclusion zones (Yes button + GIF) to avoid overlap
    const exclusionPadding = 20;
    const exclusionRects: { left: number; top: number; right: number; bottom: number }[] = [];

    const yesRect = yesButtonRef.current?.getBoundingClientRect();
    if (yesRect) {
      exclusionRects.push({
        left: yesRect.left - container.left - exclusionPadding,
        top: yesRect.top - container.top - exclusionPadding,
        right: yesRect.right - container.left + exclusionPadding,
        bottom: yesRect.bottom - container.top + exclusionPadding,
      });
    }

    const gifRect = gifRef.current?.getBoundingClientRect();
    if (gifRect) {
      exclusionRects.push({
        left: gifRect.left - container.left - exclusionPadding,
        top: gifRect.top - container.top - exclusionPadding,
        right: gifRect.right - container.left + exclusionPadding,
        bottom: gifRect.bottom - container.top + exclusionPadding,
      });
    }

    let x: number, y: number;
    let attempts = 0;
    do {
      x = safeMargin + Math.random() * Math.max(0, maxX - safeMargin);
      y = safeMargin + Math.random() * Math.max(0, maxY - safeMargin);
      attempts++;

      if (exclusionRects.length === 0 || attempts > 50) break;

      const noRight = x + btnW;
      const noBottom = y + btnH;

      const overlaps = exclusionRects.some(
        (rect) => x < rect.right && noRight > rect.left && y < rect.bottom && noBottom > rect.top
      );
      if (!overlaps) break;
    } while (true);

    setNoPosition({ x, y });
  }, [data.noTexts.length]);

  const handleYes = () => {
    setYesClicked(true);
    setTimeout(() => {
      setExiting(true);
      setTimeout(() => onReady(), 600);
    }, 1000);
  };

  const currentGifIndex = Math.min(noIndex, data.gifs.length - 1);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-white/10" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-pink-400 animate-spin" />
          </div>
          <p className="text-lg font-light opacity-80 animate-pulse">
            {data.loadingText}
          </p>
          <div className="flex gap-2 mt-2">
            {["💝", "🎁", "✨"].map((emoji, i) => (
              <span
                key={i}
                className="text-2xl animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                {emoji}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white transition-opacity duration-500 ${
        exiting ? "opacity-0 scale-95" : "opacity-100"
      }`}
    >
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/10 rounded-full animate-float"
            style={{
              left: `${10 + i * 12}%`,
              top: `${15 + (i % 4) * 20}%`,
              animationDelay: `${i * 0.6}s`,
              animationDuration: `${4 + i}s`,
            }}
          />
        ))}
      </div>

      <div
        className={`flex flex-col items-center gap-6 relative z-10 transition-all duration-700 ${
          fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* GIF */}
        <div ref={gifRef} className="relative w-48 h-48 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20">
          <img
            key={yesClicked ? "yes" : currentGifIndex}
            src={yesClicked ? data.yesGif : data.gifs[currentGifIndex]}
            alt="Surprise"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Question */}
        <h2 className="text-2xl md:text-3xl font-bold text-center px-4 mt-4">
          {yesClicked ? "Yaaay! 🎉🎊" : data.question}
        </h2>

        {/* Buttons row - same line, same size */}
        {!yesClicked && (
          <div className="flex gap-4 mt-4">
            <button
              ref={yesButtonRef}
              onClick={handleYes}
              className="min-w-[160px] px-6 py-3.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold text-lg rounded-full shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 hover:scale-105 active:scale-95 transition-all duration-300"
            >
              {data.yesText}
            </button>

            {/* No button - starts inline, then moves randomly */}
            {!noHidden && noPosition === null && (
              <button
                onClick={moveNoButton}
                onMouseEnter={moveNoButton}
                onTouchStart={(e) => { e.preventDefault(); moveNoButton(); }}
                className="min-w-[160px] px-6 py-3.5 bg-white/10 backdrop-blur-md text-white/70 font-medium rounded-full border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer"
              >
                {data.noTexts[0]}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Floating No button after first interaction */}
      {!noHidden && noPosition !== null && (
        <button
          onClick={moveNoButton}
          onMouseEnter={moveNoButton}
          onTouchStart={(e) => { e.preventDefault(); moveNoButton(); }}
          className="absolute min-w-[160px] px-6 py-3.5 bg-white/10 backdrop-blur-md text-white/70 font-medium rounded-full border border-white/20 transition-all duration-300 ease-out cursor-pointer z-20 whitespace-nowrap"
          style={{
            left: noPosition.x,
            top: noPosition.y,
          }}
        >
          {data.noTexts[noIndex]}
        </button>
      )}
    </div>
  );
}
