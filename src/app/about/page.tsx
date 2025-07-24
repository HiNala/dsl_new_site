'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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
  colors = ["#3b82f6", "#ffffff", "#ec4899", "#fbbf24", "#3b82f6"], // Blue, white, pink, yellow
  proximityRadius = 400, // Larger detection radius
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
          // Calculate proximity factor (0 = far, 1 = very close)
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

  // Simple mask radius based on proximity
  const maskRadius = Math.max(200, proximityRadius * proximityFactor);
  
  const gradientStyle = {
    backgroundImage: `linear-gradient(45deg, ${colors.join(", ")}, ${colors[0]})`,
    backgroundSize: "400% 400%",
  };

  return (
    <div ref={containerRef} className={cn("relative w-full h-full", className)}>
      {/* Base black text - always visible */}
      <h2 className="text-[clamp(32px,5vw,80px)] font-light leading-[1.0] tracking-tighter text-left text-black relative z-10">
        {children}
      </h2>
      
      {/* Animated gradient text with cursor mask - colors moving and swirling */}
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
  // Scroll to section based on hash on page load
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.substring(1);
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, []);

  return (
    <div className="scroll-container">
      
      {/* Section 1: Our Mission Detail */}
      <section id="mission" className="section-container bg-[#1a1a1a]">
        <div className="relative w-full h-full py-[4rem] px-[4vw] flex flex-col justify-center">
          
          {/* D/S/L Stacked Letters - Top Right */}
          <div className="absolute right-[4vw] top-[4rem] flex flex-col items-center">
            <span className="text-[clamp(48px,6vw,80px)] font-light text-[#4A90E2] leading-[0.8]">D</span>
            <span className="text-[clamp(48px,6vw,80px)] font-light text-[#4A90E2] leading-[0.8]">S</span>
            <span className="text-[clamp(48px,6vw,80px)] font-light text-[#4A90E2] leading-[0.8]">L</span>
          </div>

          {/* Back Button */}
          <button
            onClick={() => window.location.href = '/'}
            className="absolute top-8 left-8 text-white hover:text-[#4A90E2] transition-colors duration-300"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

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
      <section id="approach" className="section-container bg-[#4A90E2]">
        <div className="relative w-full h-full py-[4rem] px-[4vw] flex flex-col justify-center">
          
          {/* D/S/L Stacked Letters - Bottom Left */}
          <div className="absolute left-[4vw] bottom-[4rem] flex flex-col items-center">
            <span className="text-[clamp(48px,6vw,80px)] font-light text-[#F8F9FA] leading-[0.8]">D</span>
            <span className="text-[clamp(48px,6vw,80px)] font-light text-[#F8F9FA] leading-[0.8]">S</span>
            <span className="text-[clamp(48px,6vw,80px)] font-light text-[#F8F9FA] leading-[0.8]">L</span>
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
      <section id="team" className="section-container bg-white">
        <div className="relative w-full h-full py-[4rem] px-[4vw] flex flex-col justify-center">
          
          {/* D/S/L Stacked Letters - Top Left */}
          <div className="absolute left-[4vw] top-[4rem] flex flex-col items-center">
            <div className="h-[clamp(48px,6vw,80px)] leading-[0.8]">
              <ProximityGradientText
                colors={["#3b82f6", "#ec4899", "#fbbf24", "#3b82f6"]}
                proximityRadius={300}
              >
                D
              </ProximityGradientText>
            </div>
            <div className="h-[clamp(48px,6vw,80px)] leading-[0.8]">
              <ProximityGradientText
                colors={["#3b82f6", "#ec4899", "#fbbf24", "#3b82f6"]}
                proximityRadius={300}
              >
                S
              </ProximityGradientText>
            </div>
            <div className="h-[clamp(48px,6vw,80px)] leading-[0.8]">
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
      <section id="values" className="section-container bg-[#1a1a1a]">
        <div className="relative w-full h-full py-[4rem] px-[4vw] flex flex-col justify-center">
          
          {/* D/S/L Stacked Letters - Bottom Right */}
          <div className="absolute right-[4vw] bottom-[4rem] flex flex-col items-center">
            <span className="text-[clamp(48px,6vw,80px)] font-light text-[#4A90E2] leading-[0.8]">D</span>
            <span className="text-[clamp(48px,6vw,80px)] font-light text-[#4A90E2] leading-[0.8]">S</span>
            <span className="text-[clamp(48px,6vw,80px)] font-light text-[#4A90E2] leading-[0.8]">L</span>
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
              <button
                onClick={() => window.location.href = '/'}
                className="hover:text-white transition-colors duration-300"
              >
                Return to home
              </button>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
} 