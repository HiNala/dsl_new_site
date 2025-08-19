"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useMotionValue } from "framer-motion";

export default function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  // Use MotionValue for color to avoid React re-renders on every mouse move
  const ringColor = useMotionValue<string>("#ffffff");

  // Store last known mouse position so we can recalc colour on scroll without movement
  const lastPos = useRef({ x: -100, y: -100 });

  // ---------- Color helpers
  const getBrightnessFromRgb = (r: number, g: number, b: number) => (r * 299 + g * 587 + b * 114) / 255000;

  const parseRgb = (value: string): [number, number, number] | null => {
    if (!value || !value.startsWith("rgb")) return null;
    const rgb = value.match(/\d+/g)?.map(Number) ?? [];
    if (rgb.length >= 3) return [rgb[0], rgb[1], rgb[2]];
    return null;
  };

  // Detect if we're over readable text; return its color if found
  const getTextColorAtPoint = (clientX: number, clientY: number): string | null => {
    let el = document.elementFromPoint(clientX, clientY) as HTMLElement | null;
    const textTags = new Set(["SPAN","P","A","H1","H2","H3","H4","H5","H6","LI","EM","STRONG","SMALL","LABEL","DIV"]) ;
    while (el && el !== document.documentElement) {
      const style = window.getComputedStyle(el);
      const hasText = textTags.has(el.tagName) && el.textContent?.trim();
      if (hasText) {
        const color = style.color;
        const rgb = parseRgb(color);
        if (rgb) return color;
      }
      el = el.parentElement;
    }
    return null;
  };

  // Decide background lightness if no text is detected
  const isLightBackground = (clientX: number, clientY: number): boolean => {
    let el = document.elementFromPoint(clientX, clientY) as HTMLElement | null;
    let bgColor = "";

    while (el && el !== document.documentElement) {
      const style = window.getComputedStyle(el);
      bgColor = style.backgroundColor;
      if (bgColor && bgColor !== "rgba(0, 0, 0, 0)" && bgColor !== "transparent") break;
      el = el.parentElement;
    }
    if (!bgColor || bgColor === "rgba(0, 0, 0, 0)" || bgColor === "transparent") {
      bgColor = window.getComputedStyle(document.body).backgroundColor;
    }
    const rgb = parseRgb(bgColor);
    if (rgb) {
      const [r,g,b] = rgb;
      const brightness = getBrightnessFromRgb(r,g,b);
      return brightness > 0.8;
    }
    return false;
  };

  const updateRingColour = (clientX: number, clientY: number) => {
    // Sample center + four directions to better catch thin text glyphs
    const offsets = [
      [0,0],[6,0],[-6,0],[0,6],[0,-6]
    ];
    let decidedColor: string | null = null;
    for (const [dx,dy] of offsets) {
      const tx = clientX + dx;
      const ty = clientY + dy;
      const textColor = getTextColorAtPoint(tx, ty);
      if (textColor) {
        const rgb = parseRgb(textColor);
        if (rgb) {
          const [r,g,b] = rgb;
          const brightness = getBrightnessFromRgb(r,g,b);
          decidedColor = brightness < 0.5 ? "#ffffff" : "#000000"; // invert text
          break;
        }
      }
    }
    if (!decidedColor) {
      const shouldBeBlack = isLightBackground(clientX, clientY);
      decidedColor = shouldBeBlack ? "#000000" : "#ffffff";
    }
    ringColor.set(decidedColor);
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      lastPos.current = { x: e.clientX, y: e.clientY };
      // Immediate position and color updates for zero lag
      x.set(e.clientX - 16);
      y.set(e.clientY - 16);
      updateRingColour(e.clientX, e.clientY);
    };

    const handleScrollOrResize = () => {
      const { x: lx, y: ly } = lastPos.current;
      updateRingColour(lx, ly);
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("scroll", handleScrollOrResize, { passive: true });
    window.addEventListener("resize", handleScrollOrResize, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("scroll", handleScrollOrResize);
      window.removeEventListener("resize", handleScrollOrResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once – we manage updates manually

  return (
    <motion.div
      className="fixed left-0 top-0 pointer-events-none z-[9999] w-8 h-8 rounded-full border-4"
      style={{
        x,
        y,
        borderColor: ringColor,
        willChange: "transform,border-color",
        // Kick in GPU compositing for ultra-smooth transforms
        transform: "translateZ(0)"
      }}
      transition={{ duration: 0, ease: "linear" }}
    />
  );
}
