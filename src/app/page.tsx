'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

function cn(...classes: (string | undefined | null | boolean)[]): string {
  return classes.filter(Boolean).join(" ");
}

interface TextSplitProps {
  children: string;
  className?: string;
  topClassName?: string;
  bottomClassName?: string;
  maxMove?: number;
  falloff?: number;
}

const TextSplit: React.FC<TextSplitProps> = ({
  children,
  className,
  topClassName,
  bottomClassName,
  maxMove = 50,
  falloff = 0.3,
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const getOffset = (index: number) => {
    if (hoverIndex === null) return 0;
    const distance = Math.abs(index - hoverIndex);
    return Math.max(0, maxMove * (1 - distance * falloff));
  };

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {children.split("").map((char, index) => {
        const offset = getOffset(index);
        const displayChar = char === " " ? "\u00A0" : char;

        return (
          <div
            key={`${char}-${index}`}
            className="relative flex flex-col h-[1em] w-auto leading-none"
            onMouseEnter={() => setHoverIndex(index)}
            onMouseLeave={() => setHoverIndex(null)}
          >
            <motion.span
              initial={false}
              animate={{
                y: `-${offset}%`,
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={cn("overflow-hidden", topClassName)}
            >
              {displayChar}
            </motion.span>

            <motion.span
              initial={false}
              animate={{
                y: `${offset}%`,
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={cn("overflow-hidden", bottomClassName)}
            >
              <span className="block -translate-y-1/2">{displayChar}</span>
            </motion.span>
          </div>
        );
      })}
    </div>
  );
};

export default function Home() {
  const brandLetters = ['D', 'I', 'G', 'I', 'T', 'A', 'L', 'S', 'T', 'U', 'D', 'I', 'O', 'L', 'A', 'B', 'S'];

  return (
    <div className="relative w-full" style={{ 
      scrollSnapType: 'y mandatory',
      scrollBehavior: 'smooth'
    }}>
      
      {/* Section 1: Hero */}
      <section className="relative min-h-screen bg-[#F8F9FA]" style={{ scrollSnapAlign: 'start' }}>
        
        {/* Header Letters - refined like reference */}
        <div className="h-[100px] flex justify-between items-center px-[4vw] bg-[#F8F9FA]">
          {brandLetters.map((letter, index) => {
            // First letters: D (index 0), S (index 7), L (index 13)
            const isFirstLetter = index === 0 || index === 7 || index === 13;
            return (
              <span 
                key={index}
                className={`text-[clamp(14px,1.0vw,22px)] text-[#4A90E2] ${isFirstLetter ? 'font-medium underline decoration-1 underline-offset-2 decoration-[#4A90E2]/40' : 'font-light'}`}
              >
                {letter}
              </span>
            );
          })}
        </div>

        <div className="relative min-h-[calc(100vh-100px)]">
          
          {/* Main Headline - smaller and refined like reference */}
          <div className="absolute left-[4vw] top-[70px]">
            <h1 className="text-[clamp(40px,5.2vw,110px)] font-light leading-[1.1] text-[#4A90E2] max-w-[65vw]">
              We believe in the<br />
              value of what can't<br />
              be measured.
            </h1>
          </div>

          {/* Body Text Paragraph - positioned like reference */}
          <div className="absolute right-[64px] top-[390px] w-[380px]">
            <p className="text-[16px] font-normal leading-[1.6] text-[#4A90E2]">
              Digital Studio Labs is a San Francisco-based venture studio that 
              invests in founders and builds companies in the creator economy. 
              We believe in the value of what can't be measured: traits like 
              creativity, authenticity, and community. We are builders dreamers 
              artists & engineers with a shared vision of the future that is driven by 
              creators and innovation.
            </p>
          </div>

          {/* Navigation - positioned like reference */}
          <nav className="absolute left-[4vw] bottom-[80px]">
            <ul className="space-y-[6px]">
              <li><a href="#about" className="text-[16px] font-normal text-[#4A90E2] hover:opacity-70 transition-opacity">Home</a></li>
              <li><a href="#about" className="text-[16px] font-normal text-[#4A90E2] hover:opacity-70 transition-opacity">Companies</a></li>
              <li><a href="#about" className="text-[16px] font-normal text-[#4A90E2] hover:opacity-70 transition-opacity">About</a></li>
              <li><a href="#about" className="text-[16px] font-normal text-[#4A90E2] hover:opacity-70 transition-opacity">Contact</a></li>
            </ul>
          </nav>

        </div>
      </section>

      {/* Section 2: About Us */}
      <section id="about" className="relative min-h-screen bg-[#1a1a1a]" style={{ scrollSnapAlign: 'start' }}>
        <div className="relative min-h-screen py-[4rem] px-[4vw] flex flex-col">
          
          {/* D/S/L Stacked Letters - Top Right */}
          <div className="absolute right-[4vw] top-[4rem] flex flex-col items-center">
            <span className="text-[clamp(48px,6vw,80px)] font-light text-[#4A90E2] leading-[0.8]">D</span>
            <span className="text-[clamp(48px,6vw,80px)] font-light text-[#4A90E2] leading-[0.8]">S</span>
            <span className="text-[clamp(48px,6vw,80px)] font-light text-[#4A90E2] leading-[0.8]">L</span>
          </div>

          {/* About Us Headline - moved down */}
          <div className="mt-[8rem] mb-[3rem]">
            <h2 className="text-[clamp(36px,6vw,100px)] font-light leading-[1.0] text-white max-w-[50vw]">
              ABOUT US
            </h2>
          </div>

          {/* About Content Grid - Responsive and Compact */}
          <div className="flex-1 max-w-[75vw]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[2rem] md:gap-[3rem]">
              
              {/* Our Mission */}
              <div className="border-b border-white/20 pb-[1.5rem]">
                <h3 className="text-[16px] font-medium text-[#4A90E2] mb-[0.75rem]">Our Mission</h3>
                <p className="text-[14px] font-light text-white/90 leading-[1.5]">
                  To empower creators and innovators by building companies that 
                  challenge conventional thinking and celebrate human creativity.
                </p>
              </div>

              {/* Our Approach */}
              <div className="border-b border-white/20 pb-[1.5rem]">
                <h3 className="text-[16px] font-medium text-[#4A90E2] mb-[0.75rem]">Our Approach</h3>
                <p className="text-[14px] font-light text-white/90 leading-[1.5]">
                  We combine deep technical expertise with creative vision, 
                  fostering environments where breakthrough ideas can flourish.
                </p>
              </div>

              {/* Our Values */}
              <div className="border-b border-white/20 pb-[1.5rem]">
                <h3 className="text-[16px] font-medium text-[#4A90E2] mb-[0.75rem]">Our Values</h3>
                <p className="text-[14px] font-light text-white/90 leading-[1.5]">
                  Authenticity, creativity, and community drive everything we do. 
                  We believe the best solutions emerge from diverse perspectives.
                </p>
              </div>

              {/* Our Impact */}
              <div className="border-b border-white/20 pb-[1.5rem]">
                <h3 className="text-[16px] font-medium text-[#4A90E2] mb-[0.75rem]">Our Impact</h3>
                <p className="text-[14px] font-light text-white/90 leading-[1.5]">
                  Building sustainable companies that create meaningful change 
                  in the creator economy and beyond.
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Section 3: Our Work */}
      <section className="relative min-h-screen bg-[#4A90E2]" style={{ scrollSnapAlign: 'start' }}>
        <div className="relative min-h-screen py-[4rem] px-[4vw] flex flex-col">
          
          {/* D/S/L Stacked Letters - Bottom Left */}
          <div className="absolute left-[4vw] bottom-[4rem] flex flex-col items-center">
            <span className="text-[clamp(48px,6vw,80px)] font-light text-[#F8F9FA] leading-[0.8]">D</span>
            <span className="text-[clamp(48px,6vw,80px)] font-light text-[#F8F9FA] leading-[0.8]">S</span>
            <span className="text-[clamp(48px,6vw,80px)] font-light text-[#F8F9FA] leading-[0.8]">L</span>
          </div>

          {/* Our Work Headline - Right Side (flipped from About Us) */}
          <div className="absolute right-[4vw] top-[8rem] text-right">
            <TextSplit
              className="text-[clamp(36px,6vw,100px)] font-light leading-[1.0] tracking-tighter"
              topClassName="text-[#F8F9FA]"
              bottomClassName="text-white/60"
              maxMove={100}
              falloff={0.2}
            >
              OUR WORK
            </TextSplit>
          </div>

          {/* Work Content Grid - Left Side (flipped from About Us) */}
          <div className="absolute left-[4vw] top-[14rem] max-w-[70vw]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[2rem] md:gap-[3rem]">
              
              {/* Portfolio Companies */}
              <div className="border-b border-white/20 pb-[1.5rem]">
                <h3 className="text-[16px] font-medium text-[#F8F9FA] mb-[0.75rem]">Portfolio Companies</h3>
                <p className="text-[14px] font-light text-white/90 leading-[1.5]">
                  Building and investing in innovative startups that are reshaping 
                  industries and creating the future of technology.
                </p>
              </div>

              {/* Emerging Tech */}
              <div className="border-b border-white/20 pb-[1.5rem]">
                <h3 className="text-[16px] font-medium text-[#F8F9FA] mb-[0.75rem]">Emerging Tech</h3>
                <p className="text-[14px] font-light text-white/90 leading-[1.5]">
                  Exploring cutting-edge technologies like AI, blockchain, and 
                  quantum computing to unlock new possibilities.
                </p>
              </div>

              {/* Creator Tools */}
              <div className="border-b border-white/20 pb-[1.5rem]">
                <h3 className="text-[16px] font-medium text-[#F8F9FA] mb-[0.75rem]">Creator Tools</h3>
                <p className="text-[14px] font-light text-white/90 leading-[1.5]">
                  Developing platforms and tools that empower creators to build, 
                  monetize, and scale their creative endeavors.
                </p>
              </div>

              {/* Innovation Labs */}
              <div className="border-b border-white/20 pb-[1.5rem]">
                <h3 className="text-[16px] font-medium text-[#F8F9FA] mb-[0.75rem]">Innovation Labs</h3>
                <p className="text-[14px] font-light text-white/90 leading-[1.5]">
                  Experimental projects and research initiatives that push the 
                  boundaries of what's possible in technology.
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
