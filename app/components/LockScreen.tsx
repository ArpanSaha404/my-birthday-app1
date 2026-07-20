"use client";

import { useState, useEffect, useRef } from "react";

interface LockScreenProps {
  passcode: string;
  lockScreenData: {
    greeting: string;
    subtitle: string;
  };
  unlockDate: string;
  timezone: string;
  countdown: {
    title: string;
    subtitle: string;
    emoji: string;
  };
  onUnlock: () => void;
}

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

export default function LockScreen({
  passcode,
  lockScreenData,
  unlockDate,
  timezone,
  countdown,
  onUnlock,
}: LockScreenProps) {
  const [enteredCode, setEnteredCode] = useState("");
  const [error, setError] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isUnlockTime, setIsUnlockTime] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ hours: 0, minutes: 0, seconds: 0 });
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: timezone,
      });
      setCurrentTime(timeStr);

      const dateStr = now.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        timeZone: timezone,
      });
      setCurrentDate(dateStr);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, [timezone]);

  useEffect(() => {
    const checkTime = () => {
      // Get current time in the configured timezone using locale-based string comparison
      const nowInTzStr = new Date().toLocaleString("sv-SE", { timeZone: timezone }).replace(" ", "T");
      // nowInTzStr is like "2026-07-08T00:00:00" — directly comparable with unlockDate

      if (nowInTzStr >= unlockDate) {
        setIsUnlockTime(true);
        return;
      }

      // For countdown calculation
      const nowInTz = new Date(
        new Date().toLocaleString("en-US", { timeZone: timezone })
      );
      const target = new Date(unlockDate);
      const diff = target.getTime() - nowInTz.getTime();

      setIsUnlockTime(false);
      const totalSeconds = Math.floor(diff / 1000);
      setTimeLeft({
        hours: Math.floor(totalSeconds / 3600),
        minutes: Math.floor((totalSeconds % 3600) / 60),
        seconds: totalSeconds % 60,
      });
    };

    checkTime();
    const interval = setInterval(checkTime, 1000);
    return () => clearInterval(interval);
  }, [unlockDate, timezone]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length > passcode.length) return;

    setEnteredCode(value);
    setError(false);

    if (value.length === passcode.length) {
      if (value === passcode) {
        setTimeout(() => onUnlock(), 400);
      } else {
        setTimeout(() => {
          setError(true);
          setShake(true);
          setEnteredCode("");
          setTimeout(() => setShake(false), 500);
        }, 300);
      }
    }
  };

  const renderDots = () => {
    return Array.from({ length: passcode.length }).map((_, i) => (
      <div
        key={i}
        className={`w-4 h-4 rounded-full transition-all duration-300 ${
          error
            ? "bg-red-400 scale-110"
            : i < enteredCode.length
            ? "bg-white scale-110 shadow-[0_0_10px_rgba(255,255,255,0.5)]"
            : "bg-white/20 border-2 border-white/40"
        }`}
      />
    ));
  };

  const padNum = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white px-6 py-12 select-none">
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/10 rounded-full animate-float"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${4 + i}s`,
            }}
          />
        ))}
      </div>

      {/* Time & Date */}
      <div className="flex flex-col items-center mt-8 relative z-10">
        <p className="text-7xl font-thin tracking-wider">{currentTime}</p>
        <p className="text-lg font-light mt-2 opacity-80">{currentDate}</p>
      </div>

      {isUnlockTime ? (
        /* Passcode input mode */
        <div className="flex flex-col items-center gap-6 relative z-10">
          <p className="text-lg font-light text-center opacity-90 whitespace-nowrap">
            {lockScreenData.greeting}
          </p>
          <p className="text-sm opacity-60">{lockScreenData.subtitle}</p>

          <div className={`flex gap-4 mt-2 ${shake ? "animate-shake" : ""}`}>
            {renderDots()}
          </div>

          {/* Invisible input for keyboard support */}
          <input
            ref={inputRef}
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            value={enteredCode}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="absolute opacity-0 w-0 h-0"
            autoComplete="off"
          />

          {/* Styled input bar */}
          <button
            onClick={() => inputRef.current?.focus()}
            className={`relative mt-4 w-64 h-14 rounded-2xl border-2 transition-all duration-500 flex items-center justify-center gap-1 backdrop-blur-md ${
              isFocused
                ? "border-white/60 bg-white/15 shadow-[0_0_30px_rgba(255,255,255,0.15)]"
                : "border-white/25 bg-white/5"
            } ${error ? "border-red-400/60 bg-red-400/10" : ""}`}
          >
            {/* Glow effect when focused */}
            {isFocused && (
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-pink-500/10 animate-pulse" />
            )}

            {enteredCode.length === 0 ? (
              <span className="text-white/40 text-sm tracking-wider">
                Tap to enter passcode
              </span>
            ) : (
              <div className="flex gap-3">
                {enteredCode.split("").map((_, i) => (
                  <span key={i} className="text-white text-2xl font-light">•</span>
                ))}
              </div>
            )}
          </button>

          {error && (
            <p className="text-red-400 text-sm animate-pulse">Wrong passcode, try again</p>
          )}
        </div>
      ) : (
        /* Countdown mode */
        <div className="flex flex-col items-center gap-6 relative z-10">
          <p className="text-3xl font-bold tracking-wide">{countdown.title}</p>

          <div className="flex gap-4">
            {[
              { label: "Hours", value: padNum(timeLeft.hours) },
              { label: "Min", value: padNum(timeLeft.minutes) },
              { label: "Sec", value: padNum(timeLeft.seconds) },
            ].map((unit) => (
              <div key={unit.label} className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg">
                  <span className="text-3xl font-bold tabular-nums">{unit.value}</span>
                </div>
                <span className="text-xs mt-2 opacity-60 uppercase tracking-wider">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>

          <p className="text-base font-light opacity-70 text-center max-w-xs mt-2">
            {countdown.subtitle}
          </p>
          <p className="text-4xl mt-2 animate-pulse">{countdown.emoji}</p>
        </div>
      )}

      {/* Bottom swipe hint */}
      <div className="relative z-10 opacity-40 text-sm">
        {isUnlockTime ? "Enter the secret code" : "Something special is coming..."}
      </div>
    </div>
  );
}
