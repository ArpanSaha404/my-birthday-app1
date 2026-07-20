"use client";

import { useState } from "react";
import LockScreen from "./components/LockScreen";
import SurprisePrompt from "./components/SurprisePrompt";
import HeroSection from "./components/HeroSection";
import BirthdayCard from "./components/BirthdayCard";
import AgeCard from "./components/AgeCard";
import PhotoGallery from "./components/PhotoGallery";
import MemoryTimeline from "./components/MemoryTimeline";
import LoveLetter from "./components/LoveLetter";
import FlipCards from "./components/FlipCards";
import CakeSection from "./components/CakeSection";
import FinalCard from "./components/FinalCard";
import Confetti from "./components/Confetti";

import content from "../data/content.json";
import memories from "../data/memories.json";
import gallery from "../data/gallery.json";

export default function Home() {
  const [unlocked, setUnlocked] = useState(false);
  const [promptDone, setPromptDone] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const showSurprisePrompt = content.showSurprisePrompt === "y";

  const handleUnlock = () => {
    setUnlocked(true);
    if (!showSurprisePrompt) {
      setPromptDone(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  };

  const handlePromptReady = () => {
    setPromptDone(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  };

  if (!unlocked) {
    return (
      <LockScreen
        passcode={content.passcode}
        lockScreenData={content.lockScreen}
        unlockDate={content.unlockDate}
        timezone={content.timezone}
        countdown={content.countdown}
        onUnlock={handleUnlock}
      />
    );
  }

  if (showSurprisePrompt && !promptDone) {
    return (
      <SurprisePrompt
        data={content.surprisePrompt}
        onReady={handlePromptReady}
      />
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 overflow-x-hidden">
      {showConfetti && <Confetti />}

      <HeroSection
        recipientName={content.recipientName}
        heroTitle={content.heroTitle}
        heroSubtitle={content.heroSubtitle}
      />

      <BirthdayCard
        quote={content.birthdayCard.quote}
        gif={content.birthdayCard.gif}
      />

      <AgeCard
        age={content.ageCard.age}
        birthDate={content.ageCard.birthDate}
        gif={content.ageCard.gif}
        shiningText={content.ageCard.shiningText}
      />

      <PhotoGallery photos={gallery} />

      {content.showTimeline === "y" && <MemoryTimeline memories={memories} />}

      <LoveLetter
        title={content.loveLetter.title}
        paragraphs={content.loveLetter.paragraphs}
        signOff={content.loveLetter.signOff}
        senderName={content.loveLetter.senderName}
      />

      <CakeSection />

      <FlipCards
        title={content.flipCards.title}
        cards={content.flipCards.cards}
      />

      <FinalCard
        messageLine1={content.finalCard.messageLine1}
        messageLine2={content.finalCard.messageLine2}
        gif={content.finalCard.gif}
      />

      {/* Footer */}
      <footer className="py-12 text-center">
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {content.footer.message}
        </p>
        <p className="text-2xl mt-2">🎂🎉❤️</p>
      </footer>
    </main>
  );
}
