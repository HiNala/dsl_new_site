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

interface ProximityGradientTextProps {
  children: string;
  className?: string;
  colors?: string[];
  baseSpeed?: number;
  proximityRadius?: number;
}

const ProximityGradientText: React.FC<ProximityGradientTextProps> = ({
  children,
  className,
  colors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#ffd93d", "#ff6b6b"],
  baseSpeed = 8,
  proximityRadius = 200,
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isInProximity, setIsInProximity] = useState(false);
  const [proximityFactor, setProximityFactor] = useState(0);
  const [randomSpeedMultiplier, setRandomSpeedMultiplier] = useState(1);

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
          
          // Add randomness that changes based on proximity
          const randomness = 0.5 + Math.random() * 1.5; // 0.5x to 2x speed
          const proximityBoost = 1 + factor * 2; // Up to 3x speed when very close
          setRandomSpeedMultiplier(randomness * proximityBoost);
        } else {
          setProximityFactor(0);
          setRandomSpeedMultiplier(1);
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [proximityRadius]);

  const currentSpeed = baseSpeed / randomSpeedMultiplier;
  
  const maskRadius = Math.max(60, proximityRadius * proximityFactor * 0.8);
  
  const gradientStyle = {
    backgroundImage: `linear-gradient(45deg, ${colors.join(", ")})`,
    backgroundSize: "300% 300%",
  };

  return (
    <div ref={containerRef} className={cn("relative w-full h-full", className)}>
      {/* Base black text - always visible */}
      <h2 className="text-[clamp(32px,5vw,80px)] font-light leading-[1.0] tracking-tighter text-left text-black relative z-10">
        {children}
      </h2>
      
      {/* Animated gradient text with cursor mask */}
      <motion.div
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          WebkitMask: containerRef.current 
            ? `radial-gradient(circle ${maskRadius}px at ${cursorPos.x - containerRef.current.getBoundingClientRect().left}px ${cursorPos.y - containerRef.current.getBoundingClientRect().top}px, black 0%, black 70%, transparent 100%)`
            : 'none',
          mask: containerRef.current 
            ? `radial-gradient(circle ${maskRadius}px at ${cursorPos.x - containerRef.current.getBoundingClientRect().left}px ${cursorPos.y - containerRef.current.getBoundingClientRect().top}px, black 0%, black 70%, transparent 100%)`
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
              "0% 50%", 
              "100% 50%", 
              "0% 50%"
            ],
          }}
          transition={{
            duration: currentSpeed,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {children}
        </motion.h2>
        
        {/* Dynamic shimmer effect */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,${0.2 + proximityFactor * 0.3}) 50%, transparent 100%)`,
            transform: "translateX(-100%)",
          }}
          animate={isInProximity ? {
            transform: ["translateX(-100%)", "translateX(100%)"],
          } : {}}
          transition={{
            duration: currentSpeed * 0.6,
            repeat: isInProximity ? Infinity : 0,
            repeatDelay: currentSpeed * 0.3,
            ease: "easeInOut",
          }}
        />
      </motion.div>
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

          {/* Our Work Headline - Right Side (mirroring About Us) */}
          <div className="absolute right-[4vw] top-[12rem]">
            <div className="text-right mb-[3rem]">
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
          </div>

          {/* Work Content Grid - Exactly mirroring About Us but right-aligned */}
          <div className="absolute right-[4vw] top-[21rem] flex justify-end">
            <div className="max-w-[75vw]">
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

        </div>
      </section>

      {/* Section 4: Contact/Partnership */}
      <section className="relative min-h-screen bg-white" style={{ scrollSnapAlign: 'start' }}>
        <div className="relative min-h-screen py-[4rem] px-[4vw] flex flex-col">
          
          {/* D/S/L Stacked Letters - Bottom Right */}
          <div className="absolute right-[4vw] bottom-[4rem] flex flex-col items-center">
            <span className="text-[clamp(48px,6vw,80px)] font-light text-black leading-[0.8]">D</span>
            <span className="text-[clamp(48px,6vw,80px)] font-light text-black leading-[0.8]">S</span>
            <span className="text-[clamp(48px,6vw,80px)] font-light text-black leading-[0.8]">L</span>
          </div>

          {/* Main Content - Left Side (narrower to avoid image overlap) */}
          <div className="absolute left-[4vw] top-[12rem]">
            <div className="max-w-[35vw]">
              
              {/* Animated Headline */}
              <div className="mb-[3rem] h-[80px] relative">
                <ProximityGradientText
                  colors={["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#ffd93d", "#ff6b6b"]}
                  baseSpeed={6}
                  proximityRadius={250}
                >
                  LET'S CREATE
                </ProximityGradientText>
              </div>

              {/* Supporting Text */}
              <div className="space-y-[2rem] max-w-[320px]">
                <p className="text-[16px] font-light text-black/80 leading-[1.6]">
                  Ready to build something extraordinary? We partner with visionary founders 
                  and companies to create digital experiences that redefine what's possible.
                </p>
                
                <div className="space-y-[1rem]">
                  <p className="text-[14px] font-medium text-black">
                    Start the conversation
                  </p>
                  <a 
                    href="mailto:hello@digitalstudiolabs.com"
                    className="text-[14px] font-normal text-black/70 hover:text-black transition-colors duration-300 border-b border-black/20 hover:border-black/40"
                  >
                    hello@digitalstudiolabs.com
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* Right Side - Image Anchor (better positioned) */}
          <div className="absolute right-[12vw] top-[12rem] w-[280px] h-[350px]">
            <div className="w-full h-full bg-black/5 rounded-lg flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-black/10 rounded-full mx-auto flex items-center justify-center">
                  <div className="w-6 h-6 bg-black/20 rounded-lg"></div>
                </div>
                <p className="text-black/40 text-xs">
                  Professional Image<br />
                  Placeholder
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Section 5: Footer/Directory */}
      <section className="relative min-h-screen bg-black" style={{ scrollSnapAlign: 'start' }}>
        <div className="relative min-h-screen py-[4rem] px-[4vw] flex flex-col">
          
          {/* D/S/L Stacked Letters - Top Left */}
          <div className="absolute left-[4vw] top-[4rem] flex flex-col items-center">
            <span className="text-[clamp(48px,6vw,80px)] font-light text-white leading-[0.8]">D</span>
            <span className="text-[clamp(48px,6vw,80px)] font-light text-white leading-[0.8]">S</span>
            <span className="text-[clamp(48px,6vw,80px)] font-light text-white leading-[0.8]">L</span>
          </div>

          {/* Main Footer Content (moved right to avoid D/S/L overlap) */}
          <div className="absolute left-[16vw] right-[4vw] top-[8rem]">
            
            {/* Footer Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-[2.5rem] max-w-[80vw]">
              
              {/* Column 1: Services */}
              <div className="space-y-[1rem]">
                <h3 className="text-[16px] font-medium text-white mb-[1.25rem]">Services</h3>
                <div className="space-y-[0.6rem]">
                  <a href="/web-development" className="block text-[13px] font-light text-white/70 hover:text-white transition-colors duration-300">
                    Web Development
                  </a>
                  <a href="/mobile-apps" className="block text-[13px] font-light text-white/70 hover:text-white transition-colors duration-300">
                    Mobile Applications
                  </a>
                  <a href="/design" className="block text-[13px] font-light text-white/70 hover:text-white transition-colors duration-300">
                    UI/UX Design
                  </a>
                  <a href="/strategy" className="block text-[13px] font-light text-white/70 hover:text-white transition-colors duration-300">
                    Digital Strategy
                  </a>
                  <a href="/branding" className="block text-[13px] font-light text-white/70 hover:text-white transition-colors duration-300">
                    Brand Identity
                  </a>
                </div>
              </div>

              {/* Column 2: Solutions */}
              <div className="space-y-[1rem]">
                <h3 className="text-[16px] font-medium text-white mb-[1.25rem]">Solutions</h3>
                <div className="space-y-[0.6rem]">
                  <a href="/startups" className="block text-[13px] font-light text-white/70 hover:text-white transition-colors duration-300">
                    Startups
                  </a>
                  <a href="/enterprise" className="block text-[13px] font-light text-white/70 hover:text-white transition-colors duration-300">
                    Enterprise
                  </a>
                  <a href="/saas" className="block text-[13px] font-light text-white/70 hover:text-white transition-colors duration-300">
                    SaaS Products
                  </a>
                  <a href="/ecommerce" className="block text-[13px] font-light text-white/70 hover:text-white transition-colors duration-300">
                    E-commerce
                  </a>
                  <a href="/fintech" className="block text-[13px] font-light text-white/70 hover:text-white transition-colors duration-300">
                    Fintech
                  </a>
                </div>
              </div>

              {/* Column 3: Company */}
              <div className="space-y-[1rem]">
                <h3 className="text-[16px] font-medium text-white mb-[1.25rem]">Company</h3>
                <div className="space-y-[0.6rem]">
                  <a href="/about" className="block text-[13px] font-light text-white/70 hover:text-white transition-colors duration-300">
                    About Us
                  </a>
                  <a href="/team" className="block text-[13px] font-light text-white/70 hover:text-white transition-colors duration-300">
                    Our Team
                  </a>
                  <a href="/careers" className="block text-[13px] font-light text-white/70 hover:text-white transition-colors duration-300">
                    Careers
                  </a>
                  <a href="/case-studies" className="block text-[13px] font-light text-white/70 hover:text-white transition-colors duration-300">
                    Case Studies
                  </a>
                  <a href="/contact" className="block text-[13px] font-light text-white/70 hover:text-white transition-colors duration-300">
                    Contact
                  </a>
                </div>
              </div>

              {/* Column 4: Contact */}
              <div className="space-y-[1rem]">
                <h3 className="text-[16px] font-medium text-white mb-[1.25rem]">Connect</h3>
                <div className="space-y-[0.8rem]">
                  <a 
                    href="mailto:hello@digitalstudiolabs.com"
                    className="block text-[13px] font-light text-white/70 hover:text-white transition-colors duration-300"
                  >
                    hello@digitalstudiolabs.com
                  </a>
                  <a 
                    href="tel:+15551234567"
                    className="block text-[13px] font-light text-white/70 hover:text-white transition-colors duration-300"
                  >
                    +1 (555) 123-4567
                  </a>
                  <p className="text-[13px] font-light text-white/50 leading-[1.4]">
                    San Francisco, CA<br />
                    Innovation District
                  </p>
                </div>
              </div>

            </div>

            {/* Bottom Section */}
            <div className="absolute top-[21rem] left-0 right-0 border-t border-white/10 pt-[2rem]">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                
                {/* Copyright */}
                <p className="text-[12px] font-light text-white/50">
                  © 2024 Digital Studio Labs. All rights reserved.
                </p>
                
                {/* Legal Links */}
                <div className="flex space-x-4">
                  <a href="/privacy" className="text-[12px] font-light text-white/50 hover:text-white/70 transition-colors duration-300">
                    Privacy Policy
                  </a>
                  <a href="/terms" className="text-[12px] font-light text-white/50 hover:text-white/70 transition-colors duration-300">
                    Terms of Service
                  </a>
                  <a href="/cookies" className="text-[12px] font-light text-white/50 hover:text-white/70 transition-colors duration-300">
                    Cookies
                  </a>
                </div>
                
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
