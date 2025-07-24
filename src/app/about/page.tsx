'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

function cn(...classes: (string | undefined | null | boolean)[]): string {
  return classes.filter(Boolean).join(" ");
}

interface ProximityGradientTextProps {
  children: string;
  className?: string;
  colors?: string[];
  proximityRadius?: number;
}

const ProximityGradientText: React.FC<ProximityGradientTextProps> = ({
  children,
  className,
  colors = ["#3b82f6", "#ffffff", "#ec4899", "#fbbf24", "#3b82f6"],
  proximityRadius = 400,
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isInProximity, setIsInProximity] = useState(false);
  const [proximityFactor, setProximityFactor] = useState(0);

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const distance = Math.sqrt(
          Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
        );
        
        const isClose = distance < proximityRadius;
        
        setIsInProximity(isClose);
        
        if (isClose) {
          const factor = Math.max(0, 1 - (distance / proximityRadius));
          setProximityFactor(factor);
        } else {
          setProximityFactor(0);
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [proximityRadius]);

  const maskRadius = Math.max(200, proximityRadius * proximityFactor);
  
  const gradientStyle = {
    backgroundImage: `linear-gradient(45deg, ${colors.join(", ")}, ${colors[0]})`,
    backgroundSize: "400% 400%",
  };

  return (
    <div ref={containerRef} className={cn("relative w-full h-full", className)}>
      <h2 className="text-[clamp(32px,5vw,80px)] font-light leading-[1.0] tracking-tighter text-left text-black relative z-10">
        {children}
      </h2>
      
      <motion.div
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          WebkitMask: containerRef.current 
            ? `radial-gradient(circle ${maskRadius}px at ${cursorPos.x - containerRef.current.getBoundingClientRect().left}px ${cursorPos.y - containerRef.current.getBoundingClientRect().top}px, black 0%, black 60%, transparent 100%)`
            : 'none',
          mask: containerRef.current 
            ? `radial-gradient(circle ${maskRadius}px at ${cursorPos.x - containerRef.current.getBoundingClientRect().left}px ${cursorPos.y - containerRef.current.getBoundingClientRect().top}px, black 0%, black 60%, transparent 100%)`
            : 'none',
        }}
        animate={{
          opacity: isInProximity ? 1 : 0,
        }}
        transition={{
          duration: 0.3,
          ease: "easeOut"
        }}
      >
        <motion.h2
          className="text-[clamp(32px,5vw,80px)] font-light leading-[1.0] tracking-tighter text-left text-transparent"
          style={{
            ...gradientStyle,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
          }}
          animate={{
            backgroundPosition: [
              "0% 0%",
              "100% 0%",
              "100% 100%", 
              "0% 100%",
              "50% 50%",
              "0% 0%"
            ],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {children}
        </motion.h2>
      </motion.div>
    </div>
  );
};

export default function AboutPage() {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const sections = [
    { id: 'mission', title: 'Our Mission' },
    { id: 'approach', title: 'Our Approach' },
    { id: 'team', title: 'Our Team' },
    { id: 'values', title: 'Our Values' }
  ];

  // Scroll to section based on hash on page load
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.substring(1);
      const sectionIndex = sections.findIndex(section => section.id === hash);
      if (sectionIndex !== -1) {
        setCurrentSectionIndex(sectionIndex);
        setTimeout(() => {
          scrollToSection(sectionIndex);
        }, 100);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Track scroll position within the contained scroll area
  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const scrollTop = scrollContainerRef.current.scrollTop;
        const containerHeight = scrollContainerRef.current.clientHeight;
        const sectionIndex = Math.round(scrollTop / containerHeight);
        const clampedIndex = Math.max(0, Math.min(sectionIndex, sections.length - 1));
        setCurrentSectionIndex(clampedIndex);
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollToSection = (index: number) => {
    if (index >= 0 && index < sections.length && scrollContainerRef.current) {
      const containerHeight = scrollContainerRef.current.clientHeight;
      scrollContainerRef.current.scrollTo({
        top: index * containerHeight,
        behavior: 'smooth'
      });
      setCurrentSectionIndex(index);
    }
  };

  const canScrollUp = currentSectionIndex > 0;
  const canScrollDown = currentSectionIndex < sections.length - 1;

  return (
    <div className="fixed inset-0 bg-black">
      {/* Back to Home Button */}
      <motion.div 
        className="fixed top-8 left-8 z-40"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Link href="/">
          <motion.button
            className={`flex items-center space-x-2 px-4 py-2 rounded-full border-2 backdrop-blur-sm transition-all duration-300 ${
              currentSectionIndex === 2 
                ? 'border-black/20 text-black hover:border-[#4A90E2] hover:text-[#4A90E2] hover:bg-black/5' 
                : 'border-white/30 text-white hover:border-[#4A90E2] hover:text-[#4A90E2] hover:bg-white/5'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0L3 5h2v6h6V5h2L8 0z" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-sm font-light">Home</span>
          </motion.button>
        </Link>
      </motion.div>

      {/* Dynamic Navigation Arrows */}
      <div className="fixed left-8 top-1/2 transform -translate-y-1/2 z-30 flex flex-col space-y-4">
        {/* Up Arrow */}
        <motion.button
          className={`w-12 h-12 flex items-center justify-center rounded-full border-2 backdrop-blur-sm transition-all duration-300 ${
            canScrollUp 
              ? currentSectionIndex === 2
                ? 'border-black/20 text-black hover:border-[#4A90E2] hover:text-[#4A90E2] hover:bg-black/5' 
                : 'border-white/30 text-white hover:border-[#4A90E2] hover:text-[#4A90E2] hover:bg-white/5'
              : 'border-transparent text-transparent pointer-events-none'
          }`}
          onClick={() => scrollToSection(currentSectionIndex - 1)}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: canScrollUp ? 1 : 0, 
            scale: canScrollUp ? 1 : 0.8,
            y: canScrollUp ? 0 : 10
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          whileHover={{ scale: canScrollUp ? 1.1 : 0.8 }}
          whileTap={{ scale: canScrollUp ? 0.95 : 0.8 }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 7l-5 5 5-5 5 5-5-5z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.button>

        {/* Section Indicator */}
        <motion.div 
          className="flex flex-col items-center space-y-1 py-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          {sections.map((section, index) => (
            <motion.button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSectionIndex
                  ? currentSectionIndex === 2
                    ? 'bg-[#4A90E2] scale-125'
                    : 'bg-[#4A90E2] scale-125'
                  : currentSectionIndex === 2
                    ? 'bg-black/20 hover:bg-black/40'
                    : 'bg-white/30 hover:bg-white/50'
              }`}
              onClick={() => scrollToSection(index)}
              whileHover={{ scale: index === currentSectionIndex ? 1.25 : 1.1 }}
              title={section.title}
            />
          ))}
        </motion.div>

        {/* Down Arrow */}
        <motion.button
          className={`w-12 h-12 flex items-center justify-center rounded-full border-2 backdrop-blur-sm transition-all duration-300 ${
            canScrollDown 
              ? currentSectionIndex === 2
                ? 'border-black/20 text-black hover:border-[#4A90E2] hover:text-[#4A90E2] hover:bg-black/5' 
                : 'border-white/30 text-white hover:border-[#4A90E2] hover:text-[#4A90E2] hover:bg-white/5'
              : 'border-transparent text-transparent pointer-events-none'
          }`}
          onClick={() => scrollToSection(currentSectionIndex + 1)}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: canScrollDown ? 1 : 0, 
            scale: canScrollDown ? 1 : 0.8,
            y: canScrollDown ? 0 : -10
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          whileHover={{ scale: canScrollDown ? 1.1 : 0.8 }}
          whileTap={{ scale: canScrollDown ? 0.95 : 0.8 }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 13l5-5-5 5-5-5 5 5z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.button>
      </div>

      {/* Contained Scroll Area - Only 4 Sections */}
      <div 
        ref={scrollContainerRef}
        className="w-full h-full overflow-y-scroll overflow-x-hidden"
        style={{
          scrollSnapType: 'y mandatory',
          scrollBehavior: 'smooth'
        }}
      >
        {/* Section 1: Our Mission Detail */}
        <section 
          id="mission" 
          className="w-full h-full bg-[#1a1a1a] flex-shrink-0"
          style={{ 
            scrollSnapAlign: 'start',
            scrollSnapStop: 'always',
            minHeight: '100vh',
            height: '100vh'
          }}
        >
          <div className="relative w-full h-full py-[4rem] px-[4vw] flex flex-col justify-center">
            
            {/* D/S/L Stacked Letters - Top Right */}
            <div className="absolute right-[4vw] top-[4rem] flex flex-col items-center space-y-6">
              <span className="text-[clamp(48px,6vw,80px)] font-light text-[#4A90E2] leading-none">D</span>
              <span className="text-[clamp(48px,6vw,80px)] font-light text-[#4A90E2] leading-none">S</span>
              <span className="text-[clamp(48px,6vw,80px)] font-light text-[#4A90E2] leading-none">L</span>
            </div>

            {/* Content Center */}
            <div className="flex flex-col items-center justify-center text-center max-w-[900px] mx-auto">
              <motion.h2
                className="text-[clamp(48px,8vw,120px)] font-light text-[#4A90E2] mb-8"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Our Mission
              </motion.h2>
              
              <motion.p
                className="text-[clamp(18px,2.5vw,32px)] font-light text-white/90 leading-[1.5] mb-12"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
              >
                To empower creators and innovators by building companies that challenge conventional thinking and celebrate human creativity.
              </motion.p>

              {/* Navigation Hint */}
              <motion.div
                className="text-white/50 text-sm"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                viewport={{ once: true }}
              >
                Scroll to explore more about us
              </motion.div>
            </div>
          </div>
        </section>

        {/* Section 2: Our Approach Detail */}
        <section 
          id="approach" 
          className="w-full h-full bg-[#4A90E2] flex-shrink-0"
          style={{ 
            scrollSnapAlign: 'start',
            scrollSnapStop: 'always',
            minHeight: '100vh',
            height: '100vh'
          }}
        >
          <div className="relative w-full h-full py-[4rem] px-[4vw] flex flex-col justify-center">
            
            {/* D/S/L Stacked Letters - Bottom Left */}
            <div className="absolute left-[4vw] bottom-[4rem] flex flex-col items-center space-y-6">
              <span className="text-[clamp(48px,6vw,80px)] font-light text-[#F8F9FA] leading-none">D</span>
              <span className="text-[clamp(48px,6vw,80px)] font-light text-[#F8F9FA] leading-none">S</span>
              <span className="text-[clamp(48px,6vw,80px)] font-light text-[#F8F9FA] leading-none">L</span>
            </div>

            {/* Content Center */}
            <div className="flex flex-col items-center justify-center text-center max-w-[900px] mx-auto">
              <motion.h2
                className="text-[clamp(48px,8vw,120px)] font-light text-[#F8F9FA] mb-8"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Our Approach
              </motion.h2>
              
              <motion.p
                className="text-[clamp(18px,2.5vw,32px)] font-light text-white/90 leading-[1.5] mb-12"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
              >
                We combine deep technical expertise with creative vision, fostering environments where breakthrough ideas can flourish.
              </motion.p>

              {/* Navigation Hint */}
              <motion.div
                className="text-white/50 text-sm"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                viewport={{ once: true }}
              >
                Continue scrolling to learn more
              </motion.div>
            </div>
          </div>
        </section>

        {/* Section 3: Our Team Detail */}
        <section 
          id="team" 
          className="w-full h-full bg-white flex-shrink-0"
          style={{ 
            scrollSnapAlign: 'start',
            scrollSnapStop: 'always',
            minHeight: '100vh',
            height: '100vh'
          }}
        >
          <div className="relative w-full h-full py-[4rem] px-[4vw] flex flex-col justify-center">
            
            {/* D/S/L Stacked Letters - Top Left */}
            <div className="absolute left-[4vw] top-[4rem] flex flex-col items-center space-y-6">
              <div className="h-[clamp(48px,6vw,80px)] leading-none">
                <ProximityGradientText
                  colors={["#3b82f6", "#ec4899", "#fbbf24", "#3b82f6"]}
                  proximityRadius={300}
                >
                  D
                </ProximityGradientText>
              </div>
              <div className="h-[clamp(48px,6vw,80px)] leading-none">
                <ProximityGradientText
                  colors={["#3b82f6", "#ec4899", "#fbbf24", "#3b82f6"]}
                  proximityRadius={300}
                >
                  S
                </ProximityGradientText>
              </div>
              <div className="h-[clamp(48px,6vw,80px)] leading-none">
                <ProximityGradientText
                  colors={["#3b82f6", "#ec4899", "#fbbf24", "#3b82f6"]}
                  proximityRadius={300}
                >
                  L
                </ProximityGradientText>
              </div>
            </div>

            {/* Content Center */}
            <div className="flex flex-col items-center justify-center text-center max-w-[900px] mx-auto">
              <motion.h2
                className="text-[clamp(48px,8vw,120px)] font-light text-[#4A90E2] mb-8"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Our Team
              </motion.h2>
              
              <motion.p
                className="text-[clamp(18px,2.5vw,32px)] font-light text-black/80 leading-[1.5] mb-12"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
              >
                Authenticity, creativity, and community drive everything we do. We believe the best solutions emerge from diverse perspectives.
              </motion.p>

              {/* Navigation Hint */}
              <motion.div
                className="text-black/50 text-sm"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                viewport={{ once: true }}
              >
                One more section to explore
              </motion.div>
            </div>
          </div>
        </section>

        {/* Section 4: Our Values Detail */}
        <section 
          id="values" 
          className="w-full h-full bg-[#1a1a1a] flex-shrink-0"
          style={{ 
            scrollSnapAlign: 'start',
            scrollSnapStop: 'always',
            minHeight: '100vh',
            height: '100vh'
          }}
        >
          <div className="relative w-full h-full py-[4rem] px-[4vw] flex flex-col justify-center">
            
            {/* D/S/L Stacked Letters - Bottom Right */}
            <div className="absolute right-[4vw] bottom-[4rem] flex flex-col items-center space-y-6">
              <span className="text-[clamp(48px,6vw,80px)] font-light text-[#4A90E2] leading-none">D</span>
              <span className="text-[clamp(48px,6vw,80px)] font-light text-[#4A90E2] leading-none">S</span>
              <span className="text-[clamp(48px,6vw,80px)] font-light text-[#4A90E2] leading-none">L</span>
            </div>

            {/* Content Center */}
            <div className="flex flex-col items-center justify-center text-center max-w-[900px] mx-auto">
              <motion.h2
                className="text-[clamp(48px,8vw,120px)] font-light text-[#4A90E2] mb-8"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Our Values
              </motion.h2>
              
              <motion.p
                className="text-[clamp(18px,2.5vw,32px)] font-light text-white/90 leading-[1.5] mb-12"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
              >
                Building sustainable companies that create meaningful change in the creator economy and beyond.
              </motion.p>

              {/* Navigation Hint */}
              <motion.div
                className="text-white/50 text-sm"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                viewport={{ once: true }}
              >
                End of About Us sections
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 