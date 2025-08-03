"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useMotionValue } from "framer-motion";

export default function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const [useBlackRing, setUseBlackRing] = useState(false);

  // Store last known mouse position so we can recalc colour on scroll without movement
  const lastPos = useRef({ x: -100, y: -100 });

  // ---------- Helper to decide if the current background is light (hero / white cards)
  const isLightBackground = (clientX: number, clientY: number): boolean => {
    let el = document.elementFromPoint(clientX, clientY) as HTMLElement | null;
    let bgColor = "";

    // Walk up DOM until we find a non-transparent colour
    while (el && el !== document.documentElement) {
      const style = window.getComputedStyle(el);
      bgColor = style.backgroundColor;
      if (bgColor && bgColor !== "rgba(0, 0, 0, 0)" && bgColor !== "transparent") {
        break;
      }
      el = el.parentElement;
    }

    // Fallback to body background
    if (!bgColor || bgColor === "rgba(0, 0, 0, 0)" || bgColor === "transparent") {
      bgColor = window.getComputedStyle(document.body).backgroundColor;
    }

    // Decide based on known palette & brightness
    if (bgColor.startsWith("rgb")) {
      const rgb = bgColor.match(/\d+/g)?.map(Number) ?? [];
      if (rgb.length >= 3) {
        const [r, g, b] = rgb;

        // Hero (#F8F9FA) or pure-white backgrounds → BLACK ring
        if ((r >= 245 && g >= 245 && b >= 245) || (r === 255 && g === 255 && b === 255)) {
          return true;
        }

        // Blue section (#4A90E2) or dark tones → WHITE ring
        if ((r === 74 && g === 144 && b === 226) || (r <= 100 && g <= 100 && b <= 100)) {
          return false;
        }

        // Otherwise use perceived brightness as fallback
        const brightness = (r * 299 + g * 587 + b * 114) / 255000;
        return brightness > 0.8; // treat very light as light → black ring
      }
    }
    return false;
  };

  const updateRingColour = (clientX: number, clientY: number) => {
    const shouldBeBlack = isLightBackground(clientX, clientY);
    // Force immediate update without checking previous state
    setUseBlackRing(shouldBeBlack);
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      lastPos.current = { x: e.clientX, y: e.clientY };
      requestAnimationFrame(() => {
        x.set(e.clientX - 16);
        y.set(e.clientY - 16);
        updateRingColour(e.clientX, e.clientY);
      });
    };

    const handleScrollOrResize = () => {
      const { x: lx, y: ly } = lastPos.current;
      requestAnimationFrame(() => updateRingColour(lx, ly));
    };

    window.addEventListener("mousemove", handleMove, { passive: true, capture: true });
    window.addEventListener("scroll", handleScrollOrResize, { passive: true });
    window.addEventListener("resize", handleScrollOrResize, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMove, { capture: true });
      window.removeEventListener("scroll", handleScrollOrResize);
      window.removeEventListener("resize", handleScrollOrResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once – we manage updates manually

  return (
    <motion.div
      className={`fixed left-0 top-0 pointer-events-none z-[9999] w-8 h-8 rounded-full border-4 ${
        useBlackRing ? "border-black" : "border-white"
      }`}
      style={{ x, y }}
      transition={{ duration: 0 }}
    />
  );
}
