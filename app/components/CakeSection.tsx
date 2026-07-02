"use client";

import { useState, useRef } from "react";

export default function CakeSection() {
  const [activeStep, setActiveStep] = useState<"none" | "wish" | "blow" | "cut">("none");
  const [wishMade, setWishMade] = useState(false);
  const [candlesLit, setCandlesLit] = useState(true);
  const [cakeCut, setCakeCut] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [cutReady, setCutReady] = useState(false);
  const [cutProgress, setCutProgress] = useState(0);
  const [slashAngle, setSlashAngle] = useState(0);
  const cakeRef = useRef<HTMLDivElement>(null);
  const startPos = useRef<{ x: number; y: number } | null>(null);

  const handleMakeWish = () => {
    setActiveStep("wish");
    setTimeout(() => {
      setWishMade(true);
    }, 2000);
  };

  const handleBlowCandles = () => {
    if (!wishMade) return;
    setActiveStep("blow");
    setTimeout(() => {
      setCandlesLit(false);
    }, 1000);
  };

  const handleCutCake = () => {
    if (candlesLit || !wishMade || cakeCut) return;
    setActiveStep("cut");
    setCutReady(true);
  };

  const getSwipeDistance = (x: number, y: number) => {
    if (!startPos.current) return 0;
    const dx = x - startPos.current.x;
    const dy = y - startPos.current.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getSwipeAngle = (x: number, y: number) => {
    if (!startPos.current) return 0;
    const dx = x - startPos.current.x;
    const dy = y - startPos.current.y;
    return Math.atan2(dy, dx) * (180 / Math.PI);
  };

  const handleStart = (x: number, y: number) => {
    if (!cutReady) return;
    startPos.current = { x, y };
  };

  const handleMove = (x: number, y: number) => {
    if (!cutReady || !startPos.current) return;
    const distance = getSwipeDistance(x, y);
    const cakeSize = cakeRef.current?.clientWidth || 200;
    const progress = Math.min(distance / (cakeSize * 0.6), 1);
    setCutProgress(progress);
    setSlashAngle(getSwipeAngle(x, y));
  };

  const handleEnd = () => {
    if (!cutReady) return;
    if (cutProgress > 0.6) {
      setCutProgress(1);
      setTimeout(() => {
        setCakeCut(true);
        setShowCelebration(true);
        setCutReady(false);
      }, 400);
    } else {
      setCutProgress(0);
    }
    startPos.current = null;
  };

  const handleTouchStart = (e: React.TouchEvent) => handleStart(e.touches[0].clientX, e.touches[0].clientY);
  const handleTouchMove = (e: React.TouchEvent) => handleMove(e.touches[0].clientX, e.touches[0].clientY);
  const handleTouchEnd = () => handleEnd();
  const handleMouseDown = (e: React.MouseEvent) => handleStart(e.clientX, e.clientY);
  const handleMouseMove = (e: React.MouseEvent) => handleMove(e.clientX, e.clientY);
  const handleMouseUp = () => handleEnd();

  const isButtonEnabled = (btn: "wish" | "blow" | "cut") => {
    if (cakeCut) return false;
    if (btn === "wish") return !wishMade;
    if (btn === "blow") return wishMade && candlesLit;
    if (btn === "cut") return wishMade && !candlesLit && !cakeCut;
    return false;
  };

  const getHeading = () => {
    if (showCelebration) return "Sweet Celebration! 🎉";
    if (activeStep === "blow" || (wishMade && candlesLit)) return "Now Blow! 🌬️";
    if (wishMade && !candlesLit) return "Time to Cut! 🍰";
    return "Make a Wish 🎂";
  };

  return (
    <section className="py-20 px-6">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
        {getHeading()}
      </h2>

      <div className="max-w-sm mx-auto">
        {/* Cake display */}
        <div
          ref={cakeRef}
          className={`relative flex flex-col items-center justify-center min-h-[280px] ${cutReady ? "cursor-crosshair" : ""}`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {!showCelebration ? (
            <>
              {/* CSS Cake */}
              <div className={`relative transition-all duration-500 ${cakeCut ? "opacity-0 scale-75" : "opacity-100"}`}>
                {/* Candles - always visible, flames conditional */}
                <div className="flex justify-center gap-5 mb-1">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex flex-col items-center">
                      {/* Flame - only when lit */}
                      <div
                        className={`w-2.5 h-4 rounded-full mb-0.5 transition-all duration-700 ${
                          candlesLit
                            ? activeStep === "wish"
                              ? "bg-yellow-300 animate-flicker shadow-[0_0_12px_rgba(255,200,0,0.9)] opacity-100 scale-100"
                              : "bg-gradient-to-t from-orange-500 to-yellow-300 shadow-[0_0_8px_rgba(255,150,0,0.6)] opacity-100 scale-100"
                            : "opacity-0 scale-0"
                        }`}
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                      {/* Candle stick - always visible */}
                      <div className="w-1.5 h-8 bg-gradient-to-b from-pink-300 to-pink-400 rounded-sm" />
                    </div>
                  ))}
                </div>

                {/* Cake body */}
                <div className="relative">
                  <div className="w-48 h-5 bg-gradient-to-b from-white to-cream-100 rounded-t-xl mx-auto border-x border-t border-amber-200 relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-pink-200 via-rose-300 to-pink-200" />
                  </div>
                  <div className="w-48 h-12 bg-gradient-to-b from-[#f8a4b8] to-[#e8829a] mx-auto border-x border-pink-300 relative">
                    <div className="absolute -top-1 left-3 w-3 h-4 bg-white rounded-b-full" />
                    <div className="absolute -top-1 left-10 w-2.5 h-5 bg-white rounded-b-full" />
                    <div className="absolute -top-1 left-20 w-3 h-3 bg-white rounded-b-full" />
                    <div className="absolute -top-1 right-8 w-2.5 h-6 bg-white rounded-b-full" />
                    <div className="absolute -top-1 right-3 w-3 h-4 bg-white rounded-b-full" />
                  </div>
                  <div className="w-52 h-3 bg-gradient-to-b from-[#fff5e6] to-[#ffe4b8] mx-auto border-x border-amber-200" />
                  <div className="w-52 h-14 bg-gradient-to-b from-[#c9a0dc] to-[#a87bc5] mx-auto border-x border-purple-300 relative">
                    <div className="absolute top-3 left-0 right-0 flex justify-around px-3">
                      {[...Array(7)].map((_, i) => (
                        <div key={i} className="w-2 h-2 bg-white/60 rounded-full" />
                      ))}
                    </div>
                  </div>
                  <div className="w-56 h-3 bg-gradient-to-b from-[#fff5e6] to-[#ffe4b8] mx-auto border-x border-amber-200" />
                  <div className="w-56 h-12 bg-gradient-to-b from-[#7ecbf5] to-[#5bb3e0] mx-auto rounded-b-lg border-x border-b border-blue-300 relative">
                    <div className="absolute top-2 left-0 right-0 flex justify-around px-2">
                      {[...Array(9)].map((_, i) => (
                        <div key={i} className="w-1 h-8 bg-white/20 rounded-full" />
                      ))}
                    </div>
                  </div>
                  <div className="w-64 h-4 bg-gradient-to-b from-gray-200 to-gray-300 mx-auto rounded-b-xl shadow-md" />
                </div>

                {/* Wind animation */}
                {activeStep === "wish" && !wishMade && (
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-16 h-0.5 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-wind-blow"
                        style={{ top: `${20 + i * 15}%`, left: "-20%", animationDelay: `${i * 0.3}s` }}
                      />
                    ))}
                  </div>
                )}

                {/* Slash line that follows user swipe in any direction */}
                {cutReady && cutProgress > 0 && (
                  <div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  >
                    <div
                      className="h-0.5 bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)]"
                      style={{
                        width: `${cutProgress * 100}%`,
                        transform: `rotate(${slashAngle}deg)`,
                        transformOrigin: "center",
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Swipe hint */}
              {cutReady && !cakeCut && (
                <div className="absolute bottom-2 left-0 right-0 text-center pointer-events-none">
                  <p className="text-rose-500 text-xs animate-pulse font-medium">
                    Slash across the cake to cut it!
                  </p>
                </div>
              )}
            </>
          ) : (
            /* Celebration - realistic cake slice SVG */
            <div className="flex flex-col items-center gap-4 animate-fade-in">
              <svg width="140" height="160" viewBox="0 0 140 160" className="drop-shadow-xl">
                {/* Plate */}
                <ellipse cx="70" cy="148" rx="55" ry="8" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1" />

                {/* Cake slice - side face (3D look) */}
                <path d="M30 135 L70 135 L70 75 L30 105 Z" fill="#e8829a" stroke="#d4708a" strokeWidth="0.5" />
                {/* Cake slice - top face */}
                <path d="M30 105 L70 75 L110 105 L70 135 Z" fill="#f8a4b8" stroke="#e8829a" strokeWidth="0.5" />
                {/* Cake slice - right face */}
                <path d="M70 75 L110 105 L110 135 L70 135 Z" fill="#f090a8" stroke="#d4708a" strokeWidth="0.5" />

                {/* Cream layers on side */}
                <path d="M30 118 L70 118 L70 112 L30 112 Z" fill="#fff8e1" />
                <path d="M70 112 L110 118 L110 112 L70 106 Z" fill="#fff3cd" />

                {/* Purple sponge layer */}
                <path d="M30 118 L70 118 L70 128 L30 128 Z" fill="#c9a0dc" />
                <path d="M70 118 L110 118 L110 128 L70 128 Z" fill="#b88fcc" />

                {/* Top frosting - white */}
                <path d="M30 105 L70 75 L110 105 L70 108 Z" fill="white" stroke="#f5f5f5" strokeWidth="0.5" />

                {/* Frosting drips on left */}
                <ellipse cx="40" cy="108" rx="4" ry="6" fill="white" />
                <ellipse cx="55" cy="107" rx="3" ry="8" fill="white" />

                {/* Frosting drips on right */}
                <ellipse cx="85" cy="108" rx="3" ry="7" fill="white" />
                <ellipse cx="100" cy="107" rx="4" ry="5" fill="white" />

                {/* Cherry on top */}
                <circle cx="70" cy="72" r="8" fill="#dc2626" />
                <ellipse cx="67" cy="69" rx="3" ry="2" fill="#fca5a5" opacity="0.6" />
                {/* Cherry stem */}
                <path d="M70 64 Q75 58 73 52" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" />
                {/* Leaf */}
                <ellipse cx="74" cy="54" rx="4" ry="2" fill="#22c55e" transform="rotate(-20 74 54)" />

                {/* Strawberry pieces visible inside */}
                <circle cx="45" cy="122" r="3" fill="#ef4444" opacity="0.6" />
                <circle cx="85" cy="124" r="2.5" fill="#ef4444" opacity="0.5" />
                <circle cx="60" cy="130" r="2" fill="#ef4444" opacity="0.4" />

                {/* Sprinkles on frosting */}
                <rect x="50" y="80" width="4" height="1.5" rx="0.75" fill="#f472b6" transform="rotate(30 50 80)" />
                <rect x="80" y="85" width="4" height="1.5" rx="0.75" fill="#a78bfa" transform="rotate(-20 80 85)" />
                <rect x="65" y="78" width="4" height="1.5" rx="0.75" fill="#fbbf24" transform="rotate(45 65 78)" />
                <rect x="90" y="90" width="3" height="1.5" rx="0.75" fill="#34d399" transform="rotate(10 90 90)" />
                <rect x="45" y="92" width="3" height="1.5" rx="0.75" fill="#60a5fa" transform="rotate(-35 45 92)" />
              </svg>

              <p className="text-xl font-bold text-gray-900 dark:text-white mt-2">
                Enjoy your beautiful day! 🌟
              </p>
              <div className="flex gap-2 text-3xl">
                <span className="animate-bounce" style={{ animationDelay: "0s" }}>🍰</span>
                <span className="animate-bounce" style={{ animationDelay: "0.1s" }}>✨</span>
                <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>💕</span>
                <span className="animate-bounce" style={{ animationDelay: "0.3s" }}>✨</span>
                <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>🍰</span>
              </div>
            </div>
          )}
        </div>

        {/* Status text */}
        <div className="text-center mt-4 h-8">
          {activeStep === "wish" && !wishMade && (
            <p className="text-rose-500 text-sm animate-pulse">Close your eyes and make a wish...</p>
          )}
          {wishMade && candlesLit && (
            <p className="text-amber-600 text-sm">Now blow out the candles!</p>
          )}
          {cutReady && !cakeCut && (
            <p className="text-rose-500 text-sm font-medium">Slash across the cake to cut it!</p>
          )}
          {wishMade && !candlesLit && !cakeCut && !cutReady && (
            <p className="text-green-600 text-sm">Ready to cut!</p>
          )}
          {cakeCut && (
            <p className="text-purple-600 text-sm font-medium">Yay! Enjoy your cake! 🎉</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3 mt-6">
          <button
            onClick={handleMakeWish}
            disabled={!isButtonEnabled("wish")}
            className={`w-full py-3.5 rounded-2xl font-semibold text-sm transition-all duration-300 ${
              isButtonEnabled("wish")
                ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg hover:shadow-xl active:scale-95"
                : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
            }`}
          >
            {cakeCut ? "Have a wonderful year! 🌟" : wishMade ? "Wish Made ✓" : "Make a Wish ✨"}
          </button>

          <button
            onClick={handleBlowCandles}
            disabled={!isButtonEnabled("blow")}
            className={`w-full py-3.5 rounded-2xl font-semibold text-sm transition-all duration-300 ${
              isButtonEnabled("blow")
                ? "bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-lg hover:shadow-xl active:scale-95 animate-pulse"
                : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
            }`}
          >
            {!candlesLit ? "Candles Out ✓" : "Blow Out Candles 💨"}
          </button>

          <button
            onClick={handleCutCake}
            disabled={!isButtonEnabled("cut")}
            className={`w-full py-3.5 rounded-2xl font-semibold text-sm transition-all duration-300 ${
              isButtonEnabled("cut")
                ? "bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg hover:shadow-xl active:scale-95 animate-pulse"
                : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
            }`}
          >
            {cakeCut ? "Cake Cut! ✓" : "Cut the Cake 🍰"}
          </button>
        </div>
      </div>
    </section>
  );
}
