"use client";

import { useState } from "react";

interface FlipCardsProps {
  title: string;
  cards: Array<{ id: number; message: string }>;
}

export default function FlipCards({ title, cards }: FlipCardsProps) {
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [allFlipped, setAllFlipped] = useState(false);

  const handleFlip = (id: number) => {
    setFlippedCards((prev) => {
      const newSet = new Set<number>();
      if (!prev.has(id)) {
        newSet.add(id);
      }
      return newSet;
    });
    setAllFlipped(false);
  };

  const handleFlipAll = () => {
    if (allFlipped) {
      setFlippedCards(new Set());
      setAllFlipped(false);
    } else {
      setFlippedCards(new Set(cards.map((c) => c.id)));
      setAllFlipped(true);
    }
  };

  return (
    <section className="py-20 px-6">
      <h2 className="text-3xl font-bold text-center mb-2 text-gray-900 dark:text-white">
        {title} 💫
      </h2>
      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-12">
        Tap a card to reveal what&apos;s inside ✨
      </p>

      <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
        {cards.map((card) => (
          <div
            key={card.id}
            className="perspective-1000 cursor-pointer"
            onClick={() => handleFlip(card.id)}
          >
            <div
              className={`relative w-full h-36 transition-transform duration-700 transform-style-3d ${
                flippedCards.has(card.id) ? "rotate-y-180" : ""
              }`}
            >
              {/* Front */}
              <div className="absolute inset-0 backface-hidden rounded-2xl bg-gradient-to-br from-rose-500 to-purple-600 flex items-center justify-center shadow-lg">
                <span className="text-white text-4xl font-bold">{card.id}</span>
              </div>

              {/* Back */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl bg-white dark:bg-gray-800 border-2 border-rose-200 dark:border-rose-800 flex items-center justify-center p-4 shadow-lg">
                <p className="text-gray-800 dark:text-gray-100 text-sm font-medium text-center leading-relaxed">
                  {card.message}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <button
          onClick={handleFlipAll}
          className="px-8 py-3 bg-gradient-to-r from-rose-500 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl active:scale-95 transition-all duration-300"
        >
          {allFlipped ? "Hide All" : "Reveal All 🎉"}
        </button>
      </div>
    </section>
  );
}
