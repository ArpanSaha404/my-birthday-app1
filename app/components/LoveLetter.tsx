"use client";

import { useEffect, useRef, useState } from "react";

interface LoveLetterProps {
  title: string;
  paragraphs: string[];
  signOff: string;
  senderName: string;
}

export default function LoveLetter({ title, paragraphs, signOff, senderName }: LoveLetterProps) {
  const [visible, setVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
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
      <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
        {title} 💌
      </h2>

      <div
        className={`max-w-sm mx-auto transition-all duration-1000 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* Envelope container */}
        <div className="relative cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
          {/* Envelope body */}
          <div className="relative bg-gradient-to-br from-[#f4e4c1] to-[#e8d5a3] rounded-2xl shadow-xl overflow-hidden border border-[#d4c089]">
            {/* Envelope flap (top triangle) */}
            <div
              className={`absolute top-0 left-0 right-0 z-20 transition-transform duration-700 ease-in-out origin-top ${
                isOpen ? "[transform:rotateX(180deg)]" : ""
              }`}
              style={{ perspective: "1000px" }}
            >
              <svg viewBox="0 0 400 120" className="w-full block" preserveAspectRatio="none">
                <path
                  d="M0,0 L200,120 L400,0 Z"
                  fill={isOpen ? "#d4b87a" : "#e8cc8c"}
                  stroke="#d4c089"
                  strokeWidth="1"
                />
              </svg>
            </div>

            {/* Envelope back flap (visible when opened) */}
            <div className="absolute top-0 left-0 right-0 z-10">
              <svg viewBox="0 0 400 120" className="w-full block" preserveAspectRatio="none">
                <path d="M0,0 L200,120 L400,0 Z" fill="#d4b87a" stroke="#c4a060" strokeWidth="1" />
              </svg>
            </div>

            {/* Heart seal */}
            <div
              className={`absolute top-[60px] left-1/2 -translate-x-1/2 z-30 transition-all duration-500 ${
                isOpen ? "opacity-0 scale-0" : "opacity-100 scale-100"
              }`}
            >
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-xl">❤️</span>
              </div>
            </div>

            {/* Letter content area */}
            <div
              className={`relative z-15 transition-all duration-700 ease-in-out overflow-hidden ${
                isOpen ? "max-h-[800px] pt-[100px] pb-8 px-6" : "max-h-[180px] pt-[100px] pb-6 px-6"
              }`}
            >
              {/* Tap hint when closed */}
              {!isOpen && (
                <div className="flex flex-col items-center gap-2 mt-2">
                  <p className="text-[#8a7040] text-sm font-medium animate-pulse">
                    Tap to open 💕
                  </p>
                </div>
              )}

              {/* Actual letter */}
              <div
                className={`transition-all duration-700 delay-300 ${
                  isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                {/* Letter paper */}
                <div className="bg-white rounded-xl shadow-inner p-6 border border-gray-100 relative">
                  {/* Paper lines decoration */}
                  <div className="absolute inset-x-6 top-6 bottom-6 pointer-events-none">
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="border-b border-blue-50"
                        style={{ marginTop: i === 0 ? "24px" : "28px" }}
                      />
                    ))}
                  </div>

                  <div className="relative z-10 space-y-4">
                    {paragraphs.map((paragraph, index) => (
                      <p
                        key={index}
                        className="text-gray-700 leading-relaxed text-sm font-light italic"
                        style={{
                          transitionDelay: `${index * 200 + 500}ms`,
                          opacity: isOpen ? 1 : 0,
                          transform: isOpen ? "translateY(0)" : "translateY(10px)",
                          transition: "all 0.7s ease",
                        }}
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  <div
                    className="relative z-10 mt-8 text-right"
                    style={{
                      opacity: isOpen ? 1 : 0,
                      transition: "opacity 0.7s ease 1.2s",
                    }}
                  >
                    <p className="text-rose-500 font-medium text-base">{signOff},</p>
                    <p className="text-gray-800 font-bold text-lg mt-1">{senderName}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Envelope bottom decoration */}
            <div className="absolute bottom-0 left-0 right-0 z-10">
              <svg viewBox="0 0 400 60" className="w-full block" preserveAspectRatio="none">
                <path d="M0,60 L200,0 L400,60 Z" fill="#dcc180" stroke="#d4c089" strokeWidth="1" />
              </svg>
            </div>
          </div>
        </div>

        {/* Close hint */}
        {isOpen && (
          <p className="text-center text-gray-400 text-xs mt-4 animate-pulse">
            Tap envelope to close
          </p>
        )}
      </div>
    </section>
  );
}
