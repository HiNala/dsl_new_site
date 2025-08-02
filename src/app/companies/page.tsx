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

export default function CompaniesPage() {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  
  const sections = [
    { id: 'portfolio', title: 'Portfolio Companies' },
    { id: 'emerging-tech', title: 'Emerging Tech' },
    { id: 'creator-tools', title: 'Creator Tools' },
    { id: 'innovation-labs', title: 'Innovation Labs' }
  ];

  // Scroll to section based on hash on page load
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.substring(1);
      const sectionIndex = sections.findIndex(section => section.id === hash);
      if (sectionIndex !== -1) {
        setCurrentSectionIndex(sectionIndex);
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    }
  }, []);

  // Track scroll position to update current section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const sectionIndex = Math.round(scrollPosition / windowHeight);
      setCurrentSectionIndex(Math.max(0, Math.min(sectionIndex, sections.length - 1)));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (index: number) => {
    if (index >= 0 && index < sections.length) {
      const element = document.getElementById(sections[index].id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setCurrentSectionIndex(index);
      }
    }
  };

  const canScrollUp = currentSectionIndex > 0;
  const canScrollDown = currentSectionIndex < sections.length - 1;

  return (
    <div className="scroll-container">
      
      {/* Dynamic Navigation Arrows - RIGHT SIDE */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-30 flex flex-col space-y-4">
        {/* Up Arrow */}
        <motion.button
          className={`w-12 h-12 flex items-center justify-center rounded-full border-2 backdrop-blur-sm transition-all duration-300 ${
            canScrollUp 
              ? currentSectionIndex === 2 // Creator Tools section (white background)
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
          {sections.map((_, index) => (
            <motion.div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSectionIndex
                  ? currentSectionIndex === 2 // Creator Tools section (white background)
                    ? 'bg-[#4A90E2] scale-125'
                    : 'bg-[#4A90E2] scale-125'
                  : currentSectionIndex === 2 // Creator Tools section (white background)
                    ? 'bg-black/20 hover:bg-black/40'
                    : 'bg-white/30 hover:bg-white/50'
              }`}
              whileHover={{ scale: index === currentSectionIndex ? 1.25 : 1.1 }}
            />
          ))}
        </motion.div>

        {/* Down Arrow */}
        <motion.button
          className={`w-12 h-12 flex items-center justify-center rounded-full border-2 backdrop-blur-sm transition-all duration-300 ${
            canScrollDown 
              ? currentSectionIndex === 2 // Creator Tools section (white background)
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

      {/* Section 1: Portfolio Companies Detail - Great Gatsby Art Deco */}
      <section id="portfolio" className="section-container bg-black">
        <div className="relative w-full h-full py-[4rem] px-[4vw] flex flex-col justify-center overflow-hidden">
          
          {/* Art Deco Background Elements */}
          <div className="absolute inset-0">
            {/* Luxurious Corner Ornaments */}
            <div className="absolute top-0 left-0 w-40 h-40">
              <div className="absolute top-8 left-8 w-24 h-24 border-2 border-[#D4AF37]/30 rotate-45"></div>
              <div className="absolute top-12 left-12 w-16 h-16 border border-[#D4AF37]/20 rotate-45"></div>
              <div className="absolute top-6 left-6 w-2 h-2 bg-[#D4AF37]"></div>
            </div>
            
            <div className="absolute top-0 right-0 w-40 h-40">
              <div className="absolute top-8 right-8 w-24 h-24 border-2 border-[#D4AF37]/30 rotate-45"></div>
              <div className="absolute top-12 right-12 w-16 h-16 border border-[#D4AF37]/20 rotate-45"></div>
              <div className="absolute top-6 right-6 w-2 h-2 bg-[#D4AF37]"></div>
            </div>
            
            <div className="absolute bottom-0 left-0 w-40 h-40">
              <div className="absolute bottom-8 left-8 w-24 h-24 border-2 border-[#D4AF37]/30 rotate-45"></div>
              <div className="absolute bottom-12 left-12 w-16 h-16 border border-[#D4AF37]/20 rotate-45"></div>
              <div className="absolute bottom-6 left-6 w-2 h-2 bg-[#D4AF37]"></div>
            </div>
            
            <div className="absolute bottom-0 right-0 w-40 h-40">
              <div className="absolute bottom-8 right-8 w-24 h-24 border-2 border-[#D4AF37]/30 rotate-45"></div>
              <div className="absolute bottom-12 right-12 w-16 h-16 border border-[#D4AF37]/20 rotate-45"></div>
              <div className="absolute bottom-6 right-6 w-2 h-2 bg-[#D4AF37]"></div>
            </div>

            {/* Central Art Deco Pattern */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-[600px] h-[600px] relative">
                {/* Radiating Art Deco Lines */}
                {[...Array(16)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute left-1/2 top-1/2 origin-bottom w-[1px] h-[300px] bg-gradient-to-t from-[#D4AF37]/15 to-transparent"
                    style={{
                      transform: `translate(-50%, -100%) rotate(${i * 22.5}deg)`,
                    }}
                  />
                ))}
                
                {/* Central Geometric Elements */}
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-32 h-32 border border-[#D4AF37]/20 rotate-45"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 border border-[#D4AF37]/30"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-[#D4AF37]/40 rotate-45"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Art Deco D/S/L Letters - Top Left with Gold Accent */}
          <div className="absolute left-[4vw] top-[4rem] flex flex-col items-center space-y-2 z-20">
            <motion.span 
              className="text-[clamp(52px,6.5vw,88px)] font-light text-[#D4AF37] leading-none tracking-[0.15em]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              viewport={{ once: true }}
            >
              D
            </motion.span>
            <motion.span 
              className="text-[clamp(52px,6.5vw,88px)] font-light text-[#D4AF37] leading-none tracking-[0.15em]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              viewport={{ once: true }}
            >
              S
            </motion.span>
            <motion.span 
              className="text-[clamp(52px,6.5vw,88px)] font-light text-[#D4AF37] leading-none tracking-[0.15em]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              viewport={{ once: true }}
            >
              L
            </motion.span>
            
            {/* Decorative flourish */}
            <motion.div 
              className="mt-4 flex space-x-1"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              viewport={{ once: true }}
            >
              <div className="w-1 h-1 bg-[#D4AF37] rotate-45"></div>
              <div className="w-2 h-2 border border-[#D4AF37] rotate-45"></div>
              <div className="w-1 h-1 bg-[#D4AF37] rotate-45"></div>
            </motion.div>
          </div>

          {/* Great Gatsby Typography Layout */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-[1000px] mx-auto">
            
            {/* Luxurious Main Title */}
            <motion.div
              className="mb-12"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h2 className="text-[clamp(64px,10vw,180px)] font-light text-white leading-[0.8] tracking-[0.2em] mb-6">
                PORTFOLIO
              </h2>
              <h2 className="text-[clamp(64px,10vw,180px)] font-light text-[#D4AF37] leading-[0.8] tracking-[0.2em] mb-8">
                COMPANIES
              </h2>
              
              {/* Elegant Art Deco Divider */}
              <div className="flex items-center justify-center space-x-6 mb-12">
                <div className="w-16 h-[3px] bg-[#D4AF37]"></div>
                <div className="w-8 h-8 border-2 border-[#D4AF37] rotate-45 relative">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-[#D4AF37]"></div>
                </div>
                <div className="w-16 h-[3px] bg-[#D4AF37]"></div>
              </div>
            </motion.div>
            
            {/* Sophisticated Description */}
            <motion.div
              className="max-w-[750px] mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <p className="text-[clamp(22px,3vw,38px)] font-light text-white/90 leading-[1.4] tracking-[0.02em] mb-8">
                Building and investing in innovative startups
              </p>
              <p className="text-[clamp(22px,3vw,38px)] font-light text-white/90 leading-[1.4] tracking-[0.02em]">
                that are reshaping industries and creating the future of technology.
              </p>
            </motion.div>

            {/* Art Deco Investment Philosophy */}
            <motion.div
              className="grid grid-cols-3 gap-12 mb-16 max-w-[700px]"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 border-2 border-white/40 mx-auto group-hover:border-[#D4AF37] transition-colors duration-500 relative">
                    <div className="absolute inset-3 border border-white/20 group-hover:border-[#D4AF37]/60 transition-colors duration-500"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                </div>
                <h3 className="text-[18px] font-medium text-white mb-3 tracking-[0.15em]">VISION</h3>
                <p className="text-[13px] text-white/70 leading-[1.6] tracking-wide">Revolutionary ideas</p>
              </div>
              
              <div className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 border-2 border-white/40 mx-auto rotate-45 group-hover:border-[#D4AF37] transition-colors duration-500 relative">
                    <div className="absolute inset-3 border border-white/20 group-hover:border-[#D4AF37]/60 transition-colors duration-500"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-[#D4AF37] rotate-45 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                </div>
                <h3 className="text-[18px] font-medium text-white mb-3 tracking-[0.15em]">GROWTH</h3>
                <p className="text-[13px] text-white/70 leading-[1.6] tracking-wide">Exponential scaling</p>
              </div>
              
              <div className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-8 border-2 border-white/40 mx-auto group-hover:border-[#D4AF37] transition-colors duration-500 relative">
                    <div className="w-16 h-12 border-2 border-white/40 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 group-hover:border-[#D4AF37] transition-colors duration-500"></div>
                    <div className="w-12 h-16 border-2 border-white/40 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 group-hover:border-[#D4AF37] transition-colors duration-500"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-8 bg-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                </div>
                <h3 className="text-[18px] font-medium text-white mb-3 tracking-[0.15em]">IMPACT</h3>
                <p className="text-[13px] text-white/70 leading-[1.6] tracking-wide">Global transformation</p>
              </div>
            </motion.div>

            {/* Luxurious Navigation Element */}
            <motion.div
              className="relative"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-[1px] bg-[#D4AF37]"></div>
                <div className="w-2 h-2 bg-[#D4AF37] rotate-45"></div>
                <div className="w-12 h-[1px] bg-[#D4AF37]"></div>
              </div>
              <p className="text-[12px] font-light text-white/60 tracking-[0.25em] uppercase">
                Explore Our Ventures
              </p>
              <div className="flex items-center space-x-4 mt-4">
                <div className="w-12 h-[1px] bg-[#D4AF37]"></div>
                <div className="w-2 h-2 bg-[#D4AF37] rotate-45"></div>
                <div className="w-12 h-[1px] bg-[#D4AF37]"></div>
              </div>
            </motion.div>
          </div>

          {/* Art Deco Navigation Chevron */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col items-center space-y-2">
              <div className="w-10 h-10 border-2 border-[#D4AF37] flex items-center justify-center hover:bg-[#D4AF37] hover:text-black transition-all duration-300 group">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-[#D4AF37] group-hover:text-black">
                  <path d="M3 6L8 11L13 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="text-[10px] text-[#D4AF37] tracking-[0.2em] uppercase">Next</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 2: Emerging Tech Detail - Contemporary Gallery Aesthetic */}
      <section id="emerging-tech" className="section-container bg-[#f5f5f5]">
        <div className="relative w-full h-full py-0 px-0 flex flex-col justify-center overflow-hidden">
          
          {/* Large Artistic Hero Image */}
          <div className="absolute inset-0 z-10">
            <motion.div
              className="relative w-full h-full"
              initial={{ scale: 1.1, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 2, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <img
                src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1600&h=1200&fit=crop&crop=center"
                alt="Quantum computing visualization"
                className="w-full h-full object-cover object-center"
              />
              
              {/* Artistic Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/40"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
              
              {/* Contemporary Grid Overlay */}
              <div 
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
                  backgroundSize: '100px 100px'
                }}
              />
            </motion.div>
          </div>

          {/* Gallery-Style Typography Layout */}
          <div className="relative z-20 flex flex-col justify-center h-full px-[6vw] py-[8vh]">
            
            {/* Brutalist Title Block - Top Left */}
            <motion.div
              className="absolute top-[8vh] left-[6vw] max-w-[45vw]"
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="mb-6">
                <h2 className="text-[clamp(72px,12vw,200px)] font-black text-white leading-[0.75] tracking-[-0.06em] mb-0">
                  EMERGING
                </h2>
                <h2 className="text-[clamp(72px,12vw,200px)] font-black text-white leading-[0.75] tracking-[-0.06em] opacity-80">
                  TECH
                </h2>
              </div>
              
              {/* Exhibition-style Label */}
              <div className="bg-white/95 backdrop-blur-sm p-6 max-w-[400px] shadow-2xl">
                <p className="text-[11px] font-medium text-black/60 uppercase tracking-[0.15em] mb-3">
                  Research Initiative — 2024
                </p>
                <p className="text-[15px] text-black leading-[1.6] font-light mb-4">
                  Exploring cutting-edge technologies like AI, blockchain, and quantum computing to unlock new possibilities.
                </p>
                <div className="w-8 h-[1px] bg-black/30"></div>
              </div>
            </motion.div>

            {/* Artistic Quote Block - Bottom Right */}
            <motion.div
              className="absolute bottom-[8vh] right-[6vw] max-w-[400px]"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-black/80 backdrop-blur-md p-8 text-white">
                <div className="w-12 h-[2px] bg-white/60 mb-6"></div>
                <blockquote className="text-[18px] font-light leading-[1.5] italic mb-6">
                  "The future belongs to those who understand emerging technologies not as separate innovations, but as interconnected forces reshaping reality."
                </blockquote>
                <div className="text-[12px] font-medium text-white/70 uppercase tracking-[0.1em]">
                  Digital Studio Labs
                </div>
              </div>
            </motion.div>

            {/* Minimalist D/S/L - Top Right Corner */}
            <motion.div
              className="absolute top-[6vh] right-[6vw] flex space-x-3"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              viewport={{ once: true }}
            >
              <span className="text-[clamp(28px,3vw,48px)] font-light text-white/90 leading-none">D</span>
              <span className="text-[clamp(28px,3vw,48px)] font-light text-white/90 leading-none">S</span>
              <span className="text-[clamp(28px,3vw,48px)] font-light text-white/90 leading-none">L</span>
            </motion.div>

            {/* Artistic Progress Indicator - Bottom Left */}
            <motion.div
              className="absolute bottom-[6vh] left-[6vw] flex items-center space-x-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-[2px] bg-white/60"></div>
              <div className="flex space-x-2">
                <div className="w-3 h-3 border border-white/60"></div>
                <div className="w-3 h-3 bg-white"></div>
                <div className="w-3 h-3 border border-white/40"></div>
                <div className="w-3 h-3 border border-white/20"></div>
              </div>
              <span className="text-[10px] font-medium text-white/70 tracking-[0.15em] uppercase">
                02 / 04
              </span>
            </motion.div>

            {/* Gallery-Style Information Panel - Center Right */}
            <motion.div
              className="absolute top-1/2 right-[6vw] transform -translate-y-1/2 max-w-[280px]"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-6">
                <h3 className="text-[14px] font-medium text-white uppercase tracking-[0.1em] mb-4">
                  Focus Areas
                </h3>
                <div className="space-y-3">
                  <div className="text-[12px] text-white/80 leading-[1.5]">Artificial Intelligence</div>
                  <div className="text-[12px] text-white/80 leading-[1.5]">Blockchain Technology</div>
                  <div className="text-[12px] text-white/80 leading-[1.5]">Quantum Computing</div>
                  <div className="text-[12px] text-white/80 leading-[1.5]">Neural Networks</div>
                </div>
              </div>
            </motion.div>

            {/* Gallery Navigation Chevron */}
            <motion.div
              className="absolute bottom-[6vh] left-1/2 transform -translate-x-1/2 z-30"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              viewport={{ once: true }}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center hover:bg-white/30 transition-all duration-300 group">
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" className="text-white">
                    <path d="M3 6L8 11L13 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="text-[10px] text-white/70 tracking-[0.2em] uppercase">Continue</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 3: Creator Tools Detail - Modern Minimalist */}
      <section id="creator-tools" className="section-container bg-[#fafafa]">
        <div className="relative w-full h-full py-[4rem] px-[4vw] flex flex-col justify-center overflow-hidden">
          
          {/* Modern Geometric Background */}
          <div className="absolute inset-0">
            {/* Sharp Angular Lines */}
            <div className="absolute top-0 right-0 w-[400px] h-[2px] bg-gradient-to-l from-black/10 to-transparent"></div>
            <div className="absolute top-0 right-0 w-[2px] h-[400px] bg-gradient-to-b from-black/10 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[2px] bg-gradient-to-r from-black/10 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-[2px] h-[400px] bg-gradient-to-t from-black/10 to-transparent"></div>
            
            {/* Minimal Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.02]" 
                 style={{
                   backgroundImage: `linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)`,
                   backgroundSize: '60px 60px'
                 }}>
            </div>
          </div>

          {/* Modern D/S/L Letters - Clean Typography */}
          <div className="absolute right-[4vw] top-[4rem] flex flex-col items-end space-y-0 z-20">
            <motion.div 
              className="font-light text-[clamp(48px,6vw,88px)] text-black leading-[0.8] tracking-[-0.02em]"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
            >
              D
            </motion.div>
            <motion.div 
              className="font-light text-[clamp(48px,6vw,88px)] text-black leading-[0.8] tracking-[-0.02em]"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              viewport={{ once: true }}
            >
              S
            </motion.div>
            <motion.div 
              className="font-light text-[clamp(48px,6vw,88px)] text-black leading-[0.8] tracking-[-0.02em]"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              viewport={{ once: true }}
            >
              L
            </motion.div>
            
            {/* Sharp accent line */}
            <motion.div 
              className="w-16 h-[2px] bg-black mt-4"
              initial={{ width: 0 }}
              whileInView={{ width: 64 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              viewport={{ once: true }}
            />
          </div>

          {/* Modern Content Layout */}
          <div className="relative z-10 flex flex-col justify-center max-w-[800px] mx-auto">
            
            {/* Clean Typography Layout */}
            <motion.div
              className="mb-16"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h2 className="text-[clamp(64px,10vw,160px)] font-extralight text-black leading-[0.8] tracking-[-0.04em] mb-2">
                Creator
              </h2>
              <h2 className="text-[clamp(64px,10vw,160px)] font-extralight text-black leading-[0.8] tracking-[-0.04em] mb-8">
                Tools
              </h2>
              
              {/* Minimal underline */}
              <div className="w-24 h-[1px] bg-black"></div>
            </motion.div>
            
            {/* Clean Description */}
            <motion.div
              className="max-w-[600px] mb-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <p className="text-[clamp(18px,2.2vw,28px)] font-light text-black/80 leading-[1.6] tracking-[-0.01em]">
                Developing platforms and tools that empower creators to build, monetize, and scale their creative endeavors.
              </p>
            </motion.div>

            {/* Modern Feature Grid */}
            <motion.div
              className="grid grid-cols-3 gap-8 mb-20 max-w-[600px]"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="group">
                <div className="w-12 h-12 border border-black/20 mb-4 group-hover:border-black transition-colors duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </div>
                <h4 className="text-[14px] font-medium text-black tracking-[0.05em] mb-2 uppercase">Build</h4>
                <p className="text-[12px] text-black/60 leading-[1.4]">Platform development</p>
              </div>
              
              <div className="group">
                <div className="w-12 h-12 border border-black/20 mb-4 group-hover:border-black transition-colors duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/5 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                </div>
                <h4 className="text-[14px] font-medium text-black tracking-[0.05em] mb-2 uppercase">Monetize</h4>
                <p className="text-[12px] text-black/60 leading-[1.4]">Revenue optimization</p>
              </div>
              
              <div className="group">
                <div className="w-12 h-12 border border-black/20 mb-4 group-hover:border-black transition-colors duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/5 translate-y-[-100%] group-hover:translate-y-0 transition-transform duration-300"></div>
                </div>
                <h4 className="text-[14px] font-medium text-black tracking-[0.05em] mb-2 uppercase">Scale</h4>
                <p className="text-[12px] text-black/60 leading-[1.4]">Growth acceleration</p>
              </div>
            </motion.div>

            {/* Minimal Progress Indicator */}
            <motion.div
              className="flex items-center space-x-3"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              viewport={{ once: true }}
            >
              <div className="w-8 h-[1px] bg-black/30"></div>
              <div className="w-2 h-2 border border-black/40"></div>
              <div className="w-2 h-2 border border-black/40"></div>
              <div className="w-2 h-2 bg-black"></div>
              <div className="w-2 h-2 border border-black/20"></div>
              <div className="w-8 h-[1px] bg-black/30"></div>
              
              <span className="text-[11px] font-medium text-black/50 tracking-[0.08em] uppercase ml-4">
                03 of 04
              </span>
            </motion.div>
          </div>

          {/* Minimalist Navigation Chevron */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col items-center space-y-2">
              <div className="w-10 h-10 border border-black/20 flex items-center justify-center hover:border-black hover:bg-black/5 transition-all duration-300 group">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-black/60 group-hover:text-black">
                  <path d="M3 6L8 11L13 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="text-[9px] text-black/40 tracking-[0.3em] uppercase font-medium">Next</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 4: Innovation Labs Detail - Art Deco Style */}
      <section id="innovation-labs" className="section-container bg-black">
        <div className="relative w-full h-full py-[4rem] px-[4vw] flex flex-col justify-center overflow-hidden">
          
          {/* Art Deco Background Elements */}
          <div className="absolute inset-0">
            {/* Geometric Corner Decorations */}
            <div className="absolute top-0 left-0 w-32 h-32 border-r-2 border-b-2 border-[#D4AF37]/30"></div>
            <div className="absolute top-0 right-0 w-32 h-32 border-l-2 border-b-2 border-[#D4AF37]/30"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 border-r-2 border-t-2 border-[#D4AF37]/30"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 border-l-2 border-t-2 border-[#D4AF37]/30"></div>
            
            {/* Central Art Deco Rays */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-[800px] h-[800px] relative">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute left-1/2 top-1/2 origin-bottom w-[2px] h-[400px] bg-gradient-to-t from-[#D4AF37]/10 to-transparent"
                    style={{
                      transform: `translate(-50%, -100%) rotate(${i * 30}deg)`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* D/S/L Art Deco Letters - Bottom Left */}
          <div className="absolute left-[4vw] bottom-[4rem] flex flex-col items-center space-y-4 z-20">
            <motion.span 
              className="text-[clamp(52px,6.5vw,88px)] font-light text-[#D4AF37] leading-none tracking-wider"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
            >
              D
            </motion.span>
            <motion.span 
              className="text-[clamp(52px,6.5vw,88px)] font-light text-[#D4AF37] leading-none tracking-wider"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              viewport={{ once: true }}
            >
              S
            </motion.span>
            <motion.span 
              className="text-[clamp(52px,6.5vw,88px)] font-light text-[#D4AF37] leading-none tracking-wider"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              viewport={{ once: true }}
            >
              L
            </motion.span>
          </div>

          {/* Art Deco Content Layout */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-[1000px] mx-auto">
            
            {/* Main Title with Art Deco Typography */}
            <motion.div
              className="mb-12"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h2 className="text-[clamp(56px,9vw,140px)] font-light text-white leading-[0.85] tracking-[0.25em] mb-6">
                INNOVATION
              </h2>
              <h2 className="text-[clamp(56px,9vw,140px)] font-light text-[#D4AF37] leading-[0.85] tracking-[0.25em] mb-8">
                LABS
              </h2>
              
              {/* Art Deco Dividers */}
              <div className="flex items-center justify-center space-x-4 mb-8">
                <div className="w-12 h-[3px] bg-[#D4AF37]"></div>
                <div className="w-6 h-6 border-2 border-[#D4AF37] rotate-45"></div>
                <div className="w-12 h-[3px] bg-[#D4AF37]"></div>
              </div>
            </motion.div>
            
            {/* Elegant Description */}
            <motion.div
              className="max-w-[700px] mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <p className="text-[clamp(20px,2.8vw,36px)] font-light text-white/90 leading-[1.4] tracking-wide mb-6">
                Experimental projects and research initiatives
              </p>
              <p className="text-[clamp(20px,2.8vw,36px)] font-light text-white/90 leading-[1.4] tracking-wide">
                that push the boundaries of what's possible in technology.
              </p>
            </motion.div>

            {/* Art Deco Features Grid */}
            <motion.div
              className="grid grid-cols-3 gap-12 mb-16 max-w-[600px]"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="text-center group">
                <div className="w-16 h-16 border-2 border-white mx-auto mb-4 group-hover:border-[#D4AF37] transition-colors duration-500 relative">
                  <div className="absolute inset-2 bg-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <h4 className="text-[16px] font-medium text-white tracking-[0.15em] mb-2">RESEARCH</h4>
                <p className="text-[12px] text-white/70 tracking-wide">Breakthrough discoveries</p>
              </div>
              
              <div className="text-center group">
                <div className="w-16 h-16 border-2 border-white mx-auto mb-4 rotate-45 group-hover:border-[#D4AF37] transition-colors duration-500 relative">
                  <div className="absolute inset-2 bg-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <h4 className="text-[16px] font-medium text-white tracking-[0.15em] mb-2">INNOVATION</h4>
                <p className="text-[12px] text-white/70 tracking-wide">Future technologies</p>
              </div>
              
              <div className="text-center group">
                <div className="w-16 h-8 border-2 border-white mx-auto mb-4 group-hover:border-[#D4AF37] transition-colors duration-500 relative">
                  <div className="w-12 h-12 border-2 border-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 group-hover:border-[#D4AF37] transition-colors duration-500"></div>
                  <div className="absolute inset-1 bg-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <h4 className="text-[16px] font-medium text-white tracking-[0.15em] mb-2">IMPACT</h4>
                <p className="text-[12px] text-white/70 tracking-wide">Global transformation</p>
              </div>
            </motion.div>

            {/* Elegant Navigation */}
            <motion.div
              className="relative"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              viewport={{ once: true }}
            >
              <div className="w-24 h-[1px] bg-[#D4AF37] mx-auto mb-4"></div>
              <button
                onClick={() => window.location.href = '/'}
                className="text-[14px] font-light text-white/70 hover:text-[#D4AF37] transition-colors duration-500 tracking-[0.2em] uppercase"
              >
                Return to Home
              </button>
              <div className="w-24 h-[1px] bg-[#D4AF37] mx-auto mt-4"></div>
            </motion.div>
          </div>

          {/* Art Deco Final Navigation */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 border-2 border-[#D4AF37]/60 flex items-center justify-center group relative overflow-hidden">
                <div className="absolute inset-0 bg-[#D4AF37] transform scale-0 group-hover:scale-100 transition-transform duration-300 origin-center"></div>
                <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" className="text-[#D4AF37] group-hover:text-black relative z-10">
                  <path d="M8 3L3 8L8 13M3 8L13 8" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="text-[10px] text-[#D4AF37] tracking-[0.2em] uppercase">Home</div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
} 