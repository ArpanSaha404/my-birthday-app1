"use client";

import { useEffect } from "react";

const emojis = ["🎉", "🎈", "🎊", "🥳"];

export default function FaviconCycler() {
  useEffect(() => {
    let i = 0;

    const getOrCreateLink = (): HTMLLinkElement => {
      const existing = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
      if (existing) return existing;
      const link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
      return link;
    };

    const update = () => {
      const link = getOrCreateLink();
      link.href = `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${emojis[i % emojis.length]}</text></svg>`;
      i++;
    };

    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return null;
}
