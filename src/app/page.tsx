'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { EvervaultBackground } from '@/components/ui/evervault-background';
import { DynamicFrameLayout } from '@/components/ui/dynamic-frame-layout';
import { HoverSliderDemo } from '@/components/ui/hover-slider';
import Image from 'next/image';

function cn(...classes: (string | undefined | null | boolean)[]): string {
  return classes.filter(Boolean).join(" ");
}

const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0011001100110011"

function ScoreboardHeader({ letters, className = "" }: { letters: string[], className?: string }) {
  // Convert letters to words with spaces: DIGITAL STUDIO LABS
  const words = ["DIGITAL", "STUDIO", "LABS"]
  const allLetters = words.join(" ").split("")
  
  const [displayText, setDisplayText] = useState([...allLetters])
  const animationRef = React.useRef<{ [key: string]: NodeJS.Timeout }>({})

  const startAnimation = () => {
    // Clear any existing animations
    Object.values(animationRef.current).forEach((timeout) => clearTimeout(timeout))
    animationRef.current = {}

    // Calculate total animation duration
    const baseDelay = 60 // Base delay between letter animations (slower stagger)
    const letterDuration = 1200 // How long each letter takes to settle

    // Animate all letters
    allLetters.forEach((targetChar, index) => {
      // Skip spaces - they stay as spaces
      if (targetChar === " ") {
        setDisplayText((prev) => {
          const newText = [...prev]
          newText[index] = " "
          return newText
        })
        return
      }

      // Add random variation to settle time (±400ms)
      const randomVariation = (Math.random() - 0.5) * 800
      const settleTime = index * baseDelay + letterDuration + randomVariation
      let startTime: number | null = null

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp
        const elapsed = timestamp - startTime

        // If we've reached the settle time, show the final letter
        if (elapsed >= settleTime) {
          setDisplayText((prev) => {
            const newText = [...prev]
            newText[index] = targetChar
            return newText
          })
          return
        }

        // Otherwise show a random character (but stay in same position)
        setDisplayText((prev) => {
          const newText = [...prev]
          newText[index] = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)]
          return newText
        })

        // Continue animation
        animationRef.current[index] = setTimeout(() => {
          requestAnimationFrame(animate)
        }, 45)
      }

      // Start the animation
      requestAnimationFrame(animate)
    })
  }

  const handleMouseEnter = () => {
    startAnimation()
  }

  return (
    <div 
      className={`h-[100px] flex justify-between items-center px-[4vw] bg-transparent cursor-pointer relative z-20 ${className}`}
      onMouseEnter={handleMouseEnter}
    >
      {displayText.map((char, index) => {
        // Map original letter positions to new positions for D, S, L emphasis
        const originalDIndex = 0; // D in DIGITAL
        const originalSIndex = 8; // S in STUDIO (D-I-G-I-T-A-L-SPACE-S)
        const originalLIndex = 14; // L in LABS (D-I-G-I-T-A-L-SPACE-S-T-U-D-I-O-SPACE-L)
        const isFirstLetter = index === originalDIndex || index === originalSIndex || index === originalLIndex;
        
        return (
          <span 
            key={index}
            className={`
              text-[clamp(14px,1.0vw,22px)] text-black transition-all duration-300
              text-center hover:scale-110 hover:font-medium
              ${isFirstLetter ? 'font-medium' : 'font-light'}
            `}
            style={{
              animation: `fadeInScale 0.6s ease-out ${index * 0.05}s both`
            }}
          >
            {char}
          </span>
        );
      })}
    </div>
  )
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
    <div className={cn("relative flex items-center justify-center gap-[0.06em] pt-[0.06em]", className)}>
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
        // Get fresh bounds each time for accuracy
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

  // Enhanced mask radius calculation with better scaling and bounds checking
  const maskRadius = Math.max(150, Math.min(proximityRadius * proximityFactor * 1.2, 300));
  
  const gradientStyle = {
    backgroundImage: `linear-gradient(45deg, ${colors.join(", ")}, ${colors[0]})`,
    backgroundSize: "400% 400%",
  };

  // Calculate mask position with fresh bounds
  const maskX = containerRef.current ? cursorPos.x - containerRef.current.getBoundingClientRect().left : 0;
  const maskY = containerRef.current ? cursorPos.y - containerRef.current.getBoundingClientRect().top : 0;

  return (
    <div ref={containerRef} className={cn("relative w-full h-full", className)}>
      {/* Base black text - always visible */}
      <h2 className="text-[clamp(48px,6vw,80px)] font-light leading-[1.0] tracking-tighter text-left text-black relative z-10">
        {children}
      </h2>
      
      {/* Animated gradient text with cursor mask - colors moving and swirling */}
      <motion.div
        className="absolute inset-0 z-30 pointer-events-none"
        style={{
          WebkitMask: `radial-gradient(circle ${maskRadius}px at ${maskX}px ${maskY}px, black 0%, black 50%, transparent 80%)`,
          mask: `radial-gradient(circle ${maskRadius}px at ${maskX}px ${maskY}px, black 0%, black 50%, transparent 80%)`,
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
          className="text-[clamp(48px,6vw,80px)] font-light leading-[1.0] tracking-tighter text-left text-transparent"
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
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {children}
        </motion.h2>
      </motion.div>
      
      {/* Subtle always-on gradient effect for better visibility */}
      <motion.div
        className="absolute inset-0 z-20 pointer-events-none opacity-20"
        initial={false}
        animate={{
          opacity: isInProximity ? 0 : 0.1,
        }}
        transition={{
          duration: 0.5,
          ease: "easeOut"
        }}
      >
        <motion.h2
          className="text-[clamp(48px,6vw,80px)] font-light leading-[1.0] tracking-tighter text-left text-transparent"
          style={{
            ...gradientStyle,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
          }}
          animate={{
            backgroundPosition: [
              "0% 0%",
              "25% 25%",
              "50% 50%", 
              "75% 75%",
              "100% 100%",
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

interface ImageMosaicProps {
  className?: string;
}

interface DSLLetterProps {
  letter: string;
}

const DSLLetter: React.FC<DSLLetterProps> = ({ letter }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isInProximity, setIsInProximity] = useState(false);
  const [proximityFactor, setProximityFactor] = useState(0);

  const proximityRadius = 200;
  const colors = ["#3b82f6", "#ec4899", "#fbbf24", "#3b82f6"];

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

  const maskRadius = Math.max(150, Math.min(proximityRadius * proximityFactor * 1.2, 300));
  
  const gradientStyle = {
    backgroundImage: `linear-gradient(45deg, ${colors.join(", ")}, ${colors[0]})`,
    backgroundSize: "400% 400%",
  };

  const maskX = containerRef.current ? cursorPos.x - containerRef.current.getBoundingClientRect().left : 0;
  const maskY = containerRef.current ? cursorPos.y - containerRef.current.getBoundingClientRect().top : 0;

  return (
    <div ref={containerRef} className="relative text-[clamp(48px,5vw,72px)] font-light leading-none">
      {/* Base black text - always visible */}
      <span className="block text-black relative z-10">
        {letter}
      </span>
      
      {/* Animated gradient text with cursor mask - colors moving and swirling */}
      <motion.div
        className="absolute inset-0 z-30 pointer-events-none"
        style={{
          WebkitMask: `radial-gradient(circle ${maskRadius}px at ${maskX}px ${maskY}px, black 0%, black 50%, transparent 80%)`,
          mask: `radial-gradient(circle ${maskRadius}px at ${maskX}px ${maskY}px, black 0%, black 50%, transparent 80%)`,
        }}
        animate={{
          opacity: isInProximity ? 1 : 0,
        }}
        transition={{
          duration: 0.3,
          ease: "easeOut"
        }}
      >
        <motion.span
          className="block text-[clamp(48px,5vw,72px)] font-light leading-none text-transparent"
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
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {letter}
        </motion.span>
      </motion.div>
      
      {/* Subtle always-on gradient effect for better visibility */}
      <motion.div
        className="absolute inset-0 z-20 pointer-events-none opacity-20"
        initial={false}
        animate={{
          opacity: isInProximity ? 0 : 0.1,
        }}
        transition={{
          duration: 0.5,
          ease: "easeOut"
        }}
      >
        <motion.span
          className="block text-[clamp(48px,5vw,72px)] font-light leading-none text-transparent"
          style={{
            ...gradientStyle,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
          }}
          animate={{
            backgroundPosition: [
              "0% 0%",
              "25% 25%",
              "50% 50%", 
              "75% 75%",
              "100% 100%",
              "0% 0%"
            ],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {letter}
        </motion.span>
      </motion.div>
    </div>
  );
};

const DESIGN_IMAGES = [
  // Left column images (8 total, 3 portrait)
  {
    src: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&h=600",
    alt: "Modern architecture",
    aspectRatio: "aspect-[4/3]", // landscape
    width: 800,
    height: 600,
  },
  {
    src: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&h=800",
    alt: "Interior design",
    aspectRatio: "aspect-[3/4]", // portrait
    width: 600,
    height: 800,
  },
  {
    src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&h=450",
    alt: "Minimalist design",
    aspectRatio: "aspect-[16/9]", // landscape
    width: 800,
    height: 450,
  },
  {
    src: "https://images.unsplash.com/photo-1586473219010-2ffc57b0d282?auto=format&fit=crop&w=600&h=800",
    alt: "Product design",
    aspectRatio: "aspect-[3/4]", // portrait
    width: 600,
    height: 800,
  },
  {
    src: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=800&h=600",
    alt: "Graphic design",
    aspectRatio: "aspect-[4/3]", // landscape
    width: 800,
    height: 600,
  },
  {
    src: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=600&h=800",
    alt: "UI design",
    aspectRatio: "aspect-[3/4]", // portrait
    width: 600,
    height: 800,
  },
  {
    src: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&h=480",
    alt: "Brand design",
    aspectRatio: "aspect-[5/3]", // landscape
    width: 800,
    height: 480,
  },
  {
    src: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&h=600",
    alt: "Web design",
    aspectRatio: "aspect-[4/3]", // landscape
    width: 800,
    height: 600,
  },
];

const RIGHT_COLUMN_IMAGES = [
  // Right column images (8 total, 2 portrait)
  {
    src: "https://images.unsplash.com/photo-1542744173-05336fcc7ad4?auto=format&fit=crop&w=800&h=450",
    alt: "Creative workspace",
    aspectRatio: "aspect-[16/9]", // landscape
    width: 800,
    height: 450,
  },
  {
    src: "https://images.unsplash.com/photo-1542744173-b6894b6b5d8d?auto=format&fit=crop&w=600&h=800",
    alt: "Design tools",
    aspectRatio: "aspect-[3/4]", // portrait
    width: 600,
    height: 800,
  },
  {
    src: "https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=800&h=600",
    alt: "Typography",
    aspectRatio: "aspect-[4/3]", // landscape
    width: 800,
    height: 600,
  },
  {
    src: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=600&h=800",
    alt: "Color palette",
    aspectRatio: "aspect-[3/4]", // portrait
    width: 600,
    height: 800,
  },
  {
    src: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=800&h=480",
    alt: "Digital art",
    aspectRatio: "aspect-[5/3]", // landscape
    width: 800,
    height: 480,
  },
  {
    src: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=800&h=600",
    alt: "Design process",
    aspectRatio: "aspect-[4/3]", // landscape
    width: 800,
    height: 600,
  },
  {
    src: "https://images.unsplash.com/photo-1600607687920-4f2c19665e92?auto=format&fit=crop&w=800&h=450",
    alt: "Creative concept",
    aspectRatio: "aspect-[16/9]", // landscape
    width: 800,
    height: 450,
  },
  {
    src: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?auto=format&fit=crop&w=800&h=600",
    alt: "Design inspiration",
    aspectRatio: "aspect-[4/3]", // landscape
    width: 800,
    height: 600,
  },
];

const ImageMosaic: React.FC<ImageMosaicProps> = ({ className }) => {
  const leftColumnRef = React.useRef<HTMLDivElement>(null);
  const rightColumnRef = React.useRef<HTMLDivElement>(null);
  const leftScrollY = React.useRef(0);
  const rightScrollY = React.useRef(0);
  const rafIdRef = React.useRef<number | null>(null);
  const lastTsRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const SPEED_LEFT = 18; // px/sec down
    const SPEED_RIGHT = 20; // px/sec up

    const step = (ts: number) => {
      const last = lastTsRef.current ?? ts;
      const dt = (ts - last) / 1000; // seconds
      lastTsRef.current = ts;

      leftScrollY.current += SPEED_LEFT * dt;
      rightScrollY.current -= SPEED_RIGHT * dt;

      if (leftColumnRef.current) {
        const leftHeight = Math.max(1, leftColumnRef.current.scrollHeight / 3);
        leftScrollY.current = leftScrollY.current % leftHeight;
        leftColumnRef.current.style.willChange = 'transform';
        leftColumnRef.current.style.transform = `translate3d(0, -${leftScrollY.current}px, 0)`;
      }

      if (rightColumnRef.current) {
        const rightHeight = Math.max(1, rightColumnRef.current.scrollHeight / 3);
        rightScrollY.current = ((rightScrollY.current % rightHeight) + rightHeight) % rightHeight;
        rightColumnRef.current.style.willChange = 'transform';
        rightColumnRef.current.style.transform = `translate3d(0, -${rightScrollY.current}px, 0)`;
      }

      rafIdRef.current = requestAnimationFrame(step);
    };

    rafIdRef.current = requestAnimationFrame(step);
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
      lastTsRef.current = null;
    };
  }, []);

  return (
    <div className={cn("w-full h-full bg-transparent relative", className)}>
      <div className="flex h-full gap-4 relative" style={{ height: 'calc(100% + 20rem)', transform: 'translateY(-10rem)' }}>
        {/* Left Column - Scrolling Down */}
        <div className="w-1/2 relative">
          <motion.div
            ref={leftColumnRef}
            className="flex flex-col gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {/* Triple images for smoother infinite scroll */}
            {[...DESIGN_IMAGES, ...DESIGN_IMAGES, ...DESIGN_IMAGES].map((image, index) => (
              <motion.div
                key={`left-${index}`}
                className={cn(
                  "relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300",
                  image.aspectRatio,
                  "w-full flex-shrink-0"
                )}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Right Column - Scrolling Up */}
        <div className="w-1/2 relative">
          <motion.div
            ref={rightColumnRef}
            className="flex flex-col gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            {/* Triple images for smoother infinite scroll */}
            {[...RIGHT_COLUMN_IMAGES, ...RIGHT_COLUMN_IMAGES, ...RIGHT_COLUMN_IMAGES].map((image, index) => (
              <motion.div
                key={`right-${index}`}
                className={cn(
                  "relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300",
                  image.aspectRatio,
                  "w-full flex-shrink-0"
                )}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// DSL Animation Component for Footer
const DSLAnimation = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [animationStage, setAnimationStage] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Get the DSL area position (responsive to screen size) - closer to edge to match About Us
      const dslAreaX = window.innerWidth <= 480 ? 24 : window.innerWidth <= 768 ? 32 : 48; // Closer to edge
      const dslAreaY = window.innerWidth <= 480 ? 24 : window.innerWidth <= 768 ? 32 : 48; // Closer to edge

      // Define the vertical DSL area (where stacked letters occupy) - adjusted for tighter spacing
      const verticalDSLArea = {
        left: dslAreaX - 30, // Adjusted hover area
        right: dslAreaX + 30,
        top: dslAreaY - 15, // More forgiving hover area
        bottom: dslAreaY + 90, // Extended for 3 letters with tighter spacing
      };

      // Check if cursor is directly over the vertical DSL area
      const isOverVerticalDSL =
        e.clientX >= verticalDSLArea.left &&
        e.clientX <= verticalDSLArea.right &&
        e.clientY >= verticalDSLArea.top &&
        e.clientY <= verticalDSLArea.bottom;

      setIsHovering(isOverVerticalDSL);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Animation sequence on hover
  useEffect(() => {
    if (isHovering) {
      // Start the full animation sequence with smoother timing
      setAnimationStage(1); // Start falling
      
      const timer1 = setTimeout(() => setAnimationStage(2), 300); // Extended fall phase
      const timer2 = setTimeout(() => setAnimationStage(3), 600); // Extended bounce phase  
      const timer3 = setTimeout(() => setAnimationStage(4), 900); // Extended final position
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    } else {
      // Return to stacked position with delay to prevent glitches
      const timer = setTimeout(() => setAnimationStage(0), 150);
      return () => clearTimeout(timer);
    }
  }, [isHovering]);

  // Use animation stage for positioning
  const currentStage = animationStage;

  const getLetterAnimation = (letterIndex: number, stage: number) => {
    // D = index 0, S = index 1, L = index 2

    // Base stacked positions - tighter spacing to match About Us section
    const stackedPositions = [
      { x: 0, y: 0 },   // D at top (FIXED ANCHOR POINT)
      { x: 0, y: 60 },  // S in middle (reduced from 80 to 60)
      { x: 0, y: 120 }  // L at bottom (reduced from 160 to 120)
    ];

    // Horizontal positions - D stays fixed, S and L move to align with D horizontally
    const horizontalPositions = [
      { x: 0, y: 0 },    // D NEVER MOVES - stays at anchor point
      { x: 60, y: 0 },   // S moves right and up to align with D (reduced from 80 to 60)
      { x: 120, y: 0 }   // L moves right and up to align with D (reduced from 160 to 120)
    ];

    // Animation stages
    if (stage === 0) {
      // Initial stacked position
      return stackedPositions[letterIndex];
    }

    // D never moves - always stays at its fixed position
    if (letterIndex === 0) {
      return stackedPositions[0]; // D always stays at (0,0)
    }

    const stacked = stackedPositions[letterIndex];
    const horizontal = horizontalPositions[letterIndex];

    // Animation sequence positions for S and L only
    if (stage === 1) {
      // Start movement - slight shift
      return {
        x: stacked.x + (horizontal.x - stacked.x) * 0.1,
        y: stacked.y + (horizontal.y - stacked.y) * 0.1,
        rotate: 0
      };
    }

    if (stage === 2) {
      // Mid animation - 60% towards final position
      return {
        x: stacked.x + (horizontal.x - stacked.x) * 0.6,
        y: stacked.y + (horizontal.y - stacked.y) * 0.6,
        rotate: 0
      };
    }

    if (stage === 3) {
      // Near final - slight overshoot for bounce effect (only S and L)
      const overshoot = 1.05;
      return {
        x: stacked.x + (horizontal.x - stacked.x) * overshoot,
        y: stacked.y + (horizontal.y - stacked.y) * overshoot,
        rotate: 0
      };
    }

    if (stage === 4) {
      // Final position with subtle continuous movement
      const bounceOffset = Math.sin(Date.now() * 0.003 + letterIndex) * 0.5;
      return {
        x: horizontal.x + bounceOffset * 0.02,
        y: horizontal.y + Math.abs(bounceOffset) * 0.02,
        rotate: 0
      };
    }

    // Default fallback to stacked
    return stackedPositions[letterIndex];
  };

  const letters = ["D", "S", "L"];

  return (
    <div className="absolute left-[3rem] top-[3rem] z-30 md:left-[3rem] md:top-[3rem] sm:left-[2rem] sm:top-[2rem] xs:left-[1.5rem] xs:top-[1.5rem]">
      <div className="relative w-[180px] h-[180px]">
        {letters.map((letter, index) => (
          <motion.div
            key={letter}
            className="absolute text-[clamp(48px,5vw,72px)] font-light text-white leading-none select-none cursor-pointer"
            style={{
              width: "60px",
              height: "60px", 
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            animate={getLetterAnimation(index, currentStage)}
            transition={{
              type: "spring",
              stiffness: 60,
              damping: 25,
              duration: 0.8,
            }}
          >
            {letter}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const demoFrames = [
  {
    id: 1,
    video: "https://static.cdn-luma.com/files/981e483f71aa764b/Company%20Thing%20Exported.mp4",
    defaultPos: { x: 0, y: 0, w: 4, h: 4 },
    corner: "",
    edgeHorizontal: "",
    edgeVertical: "",
    mediaSize: 1,
    borderThickness: 0,
    borderSize: 100,
    isHovered: false,
  },
  {
    id: 2,
    video: "https://static.cdn-luma.com/files/58ab7363888153e3/WebGL%20Exported%20(1).mp4",
    defaultPos: { x: 4, y: 0, w: 4, h: 4 },
    corner: "",
    edgeHorizontal: "",
    edgeVertical: "",
    mediaSize: 1,
    borderThickness: 0,
    borderSize: 100,
    isHovered: false,
  },
  {
    id: 3,
    video: "https://static.cdn-luma.com/files/58ab7363888153e3/Jitter%20Exported%20Poster.mp4",
    defaultPos: { x: 8, y: 0, w: 4, h: 4 },
    corner: "",
    edgeHorizontal: "",
    edgeVertical: "",
    mediaSize: 1,
    borderThickness: 0,
    borderSize: 100,
    isHovered: false,
  },
  {
    id: 4,
    video: "https://static.cdn-luma.com/files/58ab7363888153e3/Exported%20Web%20Video.mp4",
    defaultPos: { x: 0, y: 4, w: 4, h: 4 },
    corner: "",
    edgeHorizontal: "",
    edgeVertical: "",
    mediaSize: 1,
    borderThickness: 0,
    borderSize: 100,
    isHovered: false,
  },
  {
    id: 5,
    video: "https://static.cdn-luma.com/files/58ab7363888153e3/Logo%20Exported.mp4",
    defaultPos: { x: 4, y: 4, w: 4, h: 4 },
    corner: "",
    edgeHorizontal: "",
    edgeVertical: "",
    mediaSize: 1,
    borderThickness: 0,
    borderSize: 100,
    isHovered: false,
  },
  {
    id: 6,
    video: "https://static.cdn-luma.com/files/58ab7363888153e3/Animation%20Exported%20(4).mp4",
    defaultPos: { x: 8, y: 4, w: 4, h: 4 },
    corner: "",
    edgeHorizontal: "",
    edgeVertical: "",
    mediaSize: 1,
    borderThickness: 0,
    borderSize: 100,
    isHovered: false,
  },
  {
    id: 7,
    video: "https://static.cdn-luma.com/files/58ab7363888153e3/Illustration%20Exported%20(1).mp4",
    defaultPos: { x: 0, y: 8, w: 4, h: 4 },
    corner: "",
    edgeHorizontal: "",
    edgeVertical: "",
    mediaSize: 1,
    borderThickness: 0,
    borderSize: 100,
    isHovered: false,
  },
  {
    id: 8,
    video: "https://static.cdn-luma.com/files/58ab7363888153e3/Art%20Direction%20Exported.mp4",
    defaultPos: { x: 4, y: 8, w: 4, h: 4 },
    corner: "",
    edgeHorizontal: "",
    edgeVertical: "",
    mediaSize: 1,
    borderThickness: 0,
    borderSize: 100,
    isHovered: false,
  },
  {
    id: 9,
    video: "https://static.cdn-luma.com/files/58ab7363888153e3/Product%20Video.mp4",
    defaultPos: { x: 8, y: 8, w: 4, h: 4 },
    corner: "",
    edgeHorizontal: "",
    edgeVertical: "",
    mediaSize: 1,
    borderThickness: 0,
    borderSize: 100,
    isHovered: false,
  },
];

export default function Home() {
  const brandLetters = ['D', 'I', 'G', 'I', 'T', 'A', 'L', 'S', 'T', 'U', 'D', 'I', 'O', 'L', 'A', 'B', 'S'];







  // Typing animation state
  const words = ['Together', 'Dreams', 'Reality'];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [typingStarted, setTypingStarted] = useState(false);

  // Start typing animation after footer comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !typingStarted) {
          setTimeout(() => {
            setTypingStarted(true);
          }, 800);
        }
      },
      { threshold: 0.3 }
    );

    const footerElement = document.getElementById('footer');
    if (footerElement) {
      observer.observe(footerElement);
    }

    return () => observer.disconnect();
  }, [typingStarted]);

  // Main typing logic
  useEffect(() => {
    if (!typingStarted) return;

    const currentWord = words[currentWordIndex];
    let timeoutId: NodeJS.Timeout;

    if (isTyping) {
      // Typing forward
      if (currentText.length < currentWord.length) {
        timeoutId = setTimeout(() => {
          setCurrentText(currentWord.slice(0, currentText.length + 1));
        }, 80 + Math.random() * 60);
      } else {
        // Pause at end of word
        timeoutId = setTimeout(() => {
          setIsTyping(false);
        }, 1200 + Math.random() * 400);
      }
    } else {
      // Typing backward
      if (currentText.length > 0) {
        timeoutId = setTimeout(() => {
          setCurrentText(currentText.slice(0, -1));
        }, 40 + Math.random() * 30);
      } else {
        // Move to next word
        timeoutId = setTimeout(() => {
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
          setIsTyping(true);
        }, 300 + Math.random() * 200);
      }
    }

    return () => clearTimeout(timeoutId);
  }, [currentText, isTyping, currentWordIndex, words, typingStarted]);



  // Set viewport height for mobile
  useEffect(() => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    const handleResize = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);



  return (
    <div className="scroll-container">
      
      {/* Section 1: Hero */}
      <section id="home" className="section-container bg-[#F8F9FA] relative">
        
        {/* Evervault Background Effect - only on hero section */}
        <EvervaultBackground />
        
        {/* Header Letters with Scoreboard Effect */}
        <ScoreboardHeader letters={brandLetters} />

        <div className="relative flex-1 z-10">
          
          {/* Main Headline - positioned exactly like reference */}
          <div className="absolute left-[4vw] top-[70px]">
            <h1 className="text-[clamp(38px,5.0vw,105px)] font-light leading-[1.1] text-black max-w-[65vw]">
              We believe in the<br />
              value of what can&apos;t<br />
              be measured.
            </h1>
          </div>

          {/* Body Text Paragraph - positioned exactly like reference */}
          <div className="absolute right-[4vw] top-[390px] w-[min(380px,35vw)]">
            <p className="text-[15px] font-normal leading-[1.65] text-black opacity-90">
              Digital Studio Labs is a San Francisco-based venture studio that 
              invests in founders and builds companies in the creator economy. 
              We believe in the value of what can&apos;t be measured: traits like 
              creativity, authenticity, and community. We are builders, dreamers, 
              artists & engineers with a shared vision of the future that is driven by 
              creators and innovation.
            </p>
          </div>

          {/* Navigation - positioned exactly like reference */}
          <nav className="absolute left-[4vw] bottom-[80px]">
            <ul className="space-y-[8px]">
              <li><a href="#home" className="text-[15px] font-normal text-black hover:opacity-70 transition-opacity">Home</a></li>
              <li><a href="#companies" className="text-[15px] font-normal text-black hover:opacity-70 transition-opacity">Companies</a></li>
              <li><a href="#about" className="text-[15px] font-normal text-black hover:opacity-70 transition-opacity">About</a></li>
              <li><a href="#contact" className="text-[15px] font-normal text-black hover:opacity-70 transition-opacity">Contact</a></li>
            </ul>
          </nav>

        </div>
      </section>

      {/* Section 2: About Us Title Card */}
      <section id="about-overview" className="section-container">
        <div className="relative w-full h-full bg-black">
          <div className="absolute right-[4vw] top-[4rem]">
            <h2 className="text-[clamp(48px,6vw,80px)] font-light leading-[1.0] text-white">ABOUT US</h2>
          </div>
        </div>
      </section>

      {/* Section 3: Our Work */}
      <section id="companies" className="section-container">
        <div className="relative w-full h-full bg-white">
            <div className="relative w-full h-full py-[4rem] px-[4vw] flex flex-col">
                  
            {/* Our Team Headline with Animation - Right Side */}
              <div className="absolute left-[4vw] top-[4rem] z-30">
                <div className="text-left mb-[3rem]">
                  <TextSplit
                    className="text-[clamp(48px,6vw,80px)] font-light leading-[1.0] tracking-tighter"
                    topClassName="text-black"
                    bottomClassName="text-black"
                    maxMove={100}
                    falloff={0.2}
                  >
                    OUR TEAM
                  </TextSplit>
                </div>
              </div>

              {/* Our Team Hover Slider - Focal content centered */}
              <div className="absolute inset-0 flex items-center justify-center pt-[8rem]">
                <div className="w-full max-w-[1280px]">
                  <HoverSliderDemo />
                </div>
              </div>
              
            </div>
        </div>
      </section>




      {/* Section 4: About Us Grid (moved here between Our Team and Let's Create) */}
      <section id="about" className="section-container">
        <div className="relative w-full h-full bg-black">
          <DynamicFrameLayout 
            frames={demoFrames} 
            className="w-full h-full" 
            hoverSize={6}
            gapSize={4}
          />
        </div>
      </section>


      {/* Section 5: Contact/Partnership */}
      <section id="contact" className="section-container bg-white">
        <div className="relative w-full h-full py-[4rem] px-[4vw] flex flex-col">
          
          {/* D/S/L Stacked Letters - Bottom Right (matching other sections) */}
          <div className="absolute right-[3rem] bottom-[3rem] flex flex-col items-center space-y-2 z-20 md:right-[3rem] md:bottom-[3rem] sm:right-[2rem] sm:bottom-[2rem] xs:right-[1rem] xs:bottom-[1rem]">
            <DSLLetter letter="D" />
            <DSLLetter letter="S" />
            <DSLLetter letter="L" />
          </div>

          {/* Main Content - Mobile Responsive Layout */}
          <div className="absolute left-[4vw] top-[12rem] md:left-[4vw] md:top-[12rem] md:max-w-[35vw] sm:left-[4vw] sm:top-[8rem] sm:max-w-[85vw] xs:left-[4vw] xs:top-[6rem] xs:max-w-[90vw]">
            <div className="max-w-[35vw] md:max-w-[35vw] sm:max-w-[85vw] xs:max-w-[90vw]">
              
              {/* Animated Headline */}
              <div className="relative mb-[3rem] md:mb-[3rem] sm:mb-[2rem] xs:mb-[1.5rem]">
                <ProximityGradientText
                  colors={["#3b82f6", "#ec4899", "#fbbf24", "#3b82f6"]}
                  proximityRadius={500}
                >
                  LET&apos;S CREATE
                </ProximityGradientText>
              </div>

              {/* Supporting Text */}
              <div className="space-y-[2rem] max-w-[320px] md:space-y-[2rem] md:max-w-[320px] sm:space-y-[1.5rem] sm:max-w-[100%] xs:space-y-[1rem] xs:max-w-[100%]">
                <p className="text-[16px] font-light text-black/80 leading-[1.6] md:text-[16px] sm:text-[15px] xs:text-[14px]">
                  Ready to build something extraordinary? We partner with visionary founders 
                  and companies to create digital experiences that redefine what&apos;s possible.
                </p>
                
                <p className="text-[16px] font-light text-black/80 leading-[1.6] md:text-[16px] sm:text-[15px] xs:text-[14px]">
                  From startups to Fortune 500 enterprises, we bring together strategic 
                  thinking, cutting-edge technology, and exceptional design to transform 
                  ambitious ideas into reality.
                </p>
                
                <div className="space-y-[1rem] md:space-y-[1rem] sm:space-y-[0.75rem] xs:space-y-[0.5rem]">
                  <p className="text-[14px] font-medium text-black md:text-[14px] sm:text-[13px] xs:text-[12px]">
                    Start the conversation
                  </p>
                  <a 
                    href="mailto:hello@digitalstudiolabs.com"
                    className="text-[14px] font-normal text-black/70 hover:text-black transition-colors duration-300 border-b border-black/20 hover:border-black/40 md:text-[14px] sm:text-[13px] xs:text-[12px]"
                  >
                    hello@digitalstudiolabs.com
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* Dynamic Image Mosaic - Extending to section edges */}
          <div className="absolute left-[45vw] top-0 bottom-0 w-[550px] z-10 overflow-hidden lg:left-[45vw] lg:w-[550px] md:left-[42vw] md:w-[480px] md:top-0 md:bottom-0 sm:left-[38vw] sm:w-[400px] sm:top-0 sm:bottom-0 xs:hidden"
               style={{backgroundColor: 'transparent'}}>
            <ImageMosaic className="w-full h-full" />
          </div>

        </div>
      </section>

            {/* Section 5: Footer/Directory */}
      <section id="footer" className="section-container bg-black relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(74, 144, 226, 0.3) 1px, transparent 0)`,
              backgroundSize: '32px 32px'
            }}
          />
        </div>

        <div className="relative w-full h-full py-[4rem] px-[4vw] flex flex-col">
          
          {/* D/S/L Animated Letters - Top Left */}
          <DSLAnimation />

          {/* Animated Welcome Section */}
          <motion.div 
            className="mt-[6rem] mb-[4rem] text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div
              className="relative inline-block"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h2 className="text-[clamp(36px,5vw,72px)] font-light leading-[1.1] text-white mb-[2rem] tracking-wide flex items-center">
                <span className="mr-4">Let&apos;s Create</span>
                <motion.span 
                  className="text-white inline-block relative min-w-[120px] text-left"
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ 
                    opacity: typingStarted ? 1 : 0, 
                    scale: typingStarted ? 1 : 0.8,
                    y: typingStarted ? 0 : 20
                  }}
                  transition={{ 
                    duration: 0.8, 
                    delay: 0.3, 
                    type: "spring",
                    stiffness: 100,
                    damping: 15
                  }}
                >
                  {/* Main text with character-by-character entrance */}
                  <span className="relative">
                    {currentText.split('').map((char, index) => (
                      <motion.span
                        key={`${currentWordIndex}-${index}`}
                        className="inline-block"
                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                        animate={{ 
                          opacity: 1, 
                          y: 0, 
                          scale: 1,
                          color: ['#ffffff', '#e5e7eb', '#ffffff']
                        }}
                        transition={{ 
                          duration: 0.2,
                          delay: index * 0.03,
                          scale: { type: "spring", stiffness: 300, damping: 20 },
                          color: { duration: 0.8, repeat: Infinity, repeatType: "reverse" }
                        }}
                      >
                        {char}
                      </motion.span>
                    ))}
                  </span>

                  {/* Subtle glow effect around the text */}
                  <motion.div
                    className="absolute inset-0 bg-white/20 blur-xl rounded-lg"
                    animate={{
                      opacity: [0.2, 0.4, 0.2],
                      scale: [0.8, 1.1, 0.8]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />

                  {/* Sparkle particles for extra delight */}
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-white rounded-full"
                      style={{
                        left: `${20 + i * 30}%`,
                        top: `${10 + i * 10}%`
                      }}
                      animate={{
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0],
                        rotate: [0, 180, 360]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.5,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </motion.span>
              </h2>
            </motion.div>
            <motion.p 
              className="text-[16px] font-light text-white/70 leading-[1.6] max-w-[560px] mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
            >
              Ready to transform your vision into reality? Join us in building the future of the creator economy.
            </motion.p>
          </motion.div>

          {/* Main Footer Content */}
          <div className="max-w-[1200px] mx-auto w-full">
            
            <motion.div 
              className="grid grid-cols-1 lg:grid-cols-12 gap-[3rem] lg:gap-[4rem] mb-[4rem]"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, staggerChildren: 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              
              {/* Newsletter & Company Info */}
              <motion.div 
                className="lg:col-span-5"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="space-y-[2rem]">
                  <div>
                    <h3 className="text-[clamp(20px,2.5vw,28px)] font-light text-white mb-[1rem] tracking-wide">
                      Digital Studio Labs
                    </h3>
                    <p className="text-[14px] font-light text-white/70 leading-[1.5] max-w-[420px]">
                      We believe in the power of creativity and innovation to transform industries and inspire meaningful change in the creator economy.
                    </p>
                  </div>

                  {/* Newsletter Signup */}
              <div className="space-y-[1rem]">
                    <h4 className="text-[16px] font-light text-white tracking-wide">
                      Stay in the Loop
                    </h4>
                    <div className="relative group max-w-[400px]">
                      <input
                        type="email"
                        placeholder="Enter your email address"
                        className="w-full bg-transparent border border-white/20 rounded-none px-4 py-3 text-white placeholder:text-white/40 text-[14px] font-light focus:outline-none focus:border-white transition-all duration-300"
                      />
                      <motion.button
                        className="absolute right-0 top-0 h-full px-6 bg-white text-black text-[14px] font-light hover:bg-gray-100 transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Subscribe
                      </motion.button>
                </div>
                    <p className="text-[12px] font-light text-white/50">
                      Get insights on innovation, design trends, and creator economy updates.
                    </p>
              </div>
                </div>
              </motion.div>

              {/* Navigation Grid */}
              <div className="lg:col-span-7">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-[2rem]">
                  
                  {/* Services */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    viewport={{ once: true }}
                  >
                    <h3 className="text-[14px] font-medium text-white mb-[2rem] tracking-wide uppercase">
                      Services
                    </h3>
                    <div className="space-y-[1.2rem]">
                      {[
                        { name: "Web Development", href: "/web-development" },
                        { name: "Mobile Applications", href: "/mobile-apps" },
                        { name: "UI/UX Design", href: "/design" },
                        { name: "Digital Strategy", href: "/strategy" },
                        { name: "Brand Identity", href: "/branding" }
                      ].map((item, index) => (
                        <motion.a 
                          key={index}
                          href={item.href} 
                          className="block text-[14px] font-light text-white/60 hover:text-white transition-all duration-300 group"
                          whileHover={{ x: 4 }}
                        >
                          <span className="flex items-center">
                            <span className="w-0 h-[1px] bg-white group-hover:w-4 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                            {item.name}
                          </span>
                        </motion.a>
                      ))}
                </div>
                  </motion.div>

                  {/* Solutions */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    <h3 className="text-[14px] font-medium text-white mb-[2rem] tracking-wide uppercase">
                      Solutions
                    </h3>
                    <div className="space-y-[1.2rem]">
                      {[
                        { name: "Startups", href: "/startups" },
                        { name: "Enterprise", href: "/enterprise" },
                        { name: "SaaS Products", href: "/saas" },
                        { name: "E-commerce", href: "/ecommerce" },
                        { name: "Fintech", href: "/fintech" }
                      ].map((item, index) => (
                        <motion.a 
                          key={index}
                          href={item.href} 
                          className="block text-[14px] font-light text-white/60 hover:text-white transition-all duration-300 group"
                          whileHover={{ x: 4 }}
                        >
                          <span className="flex items-center">
                            <span className="w-0 h-[1px] bg-white group-hover:w-4 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                            {item.name}
                          </span>
                        </motion.a>
                      ))}
              </div>
                  </motion.div>

                  {/* Company */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    viewport={{ once: true }}
                  >
                    <h3 className="text-[14px] font-medium text-white mb-[2rem] tracking-wide uppercase">
                      Company
                    </h3>
                    <div className="space-y-[1.2rem]">
                      {[
            
                        { name: "Our Team", href: "/team" },
                        { name: "Careers", href: "/careers" },
                        { name: "Case Studies", href: "/case-studies" },
                        { name: "Contact", href: "/contact" }
                      ].map((item, index) => (
                        <motion.a 
                          key={index}
                          href={item.href} 
                          className="block text-[14px] font-light text-white/60 hover:text-white transition-all duration-300 group"
                          whileHover={{ x: 4 }}
                        >
                          <span className="flex items-center">
                            <span className="w-0 h-[1px] bg-white group-hover:w-4 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                            {item.name}
                          </span>
                        </motion.a>
                      ))}
                    </div>
                  </motion.div>

                </div>
              </div>

            </motion.div>

            {/* Contact & Social Section */}
            <motion.div 
              className="border-t border-white/[0.08] pt-[2rem] mb-[2rem]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-[2rem] lg:gap-[4rem]">
                
                {/* Contact Info */}
                <div>
                  <h3 className="text-[16px] font-light text-white mb-[1.5rem] tracking-wide">
                    Connect With Us
                  </h3>
                  <div className="space-y-[1.5rem]">
                    <motion.a
                    href="mailto:hello@digitalstudiolabs.com"
                      className="group flex items-center space-x-3 text-white/70 hover:text-white transition-colors duration-300"
                      whileHover={{ x: 4 }}
                    >
                      <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white transition-colors duration-300">
                        <span className="text-[10px]">@</span>
                      </div>
                      <span className="text-[14px] font-light">hello@digitalstudiolabs.com</span>
                    </motion.a>
                    <motion.a
                    href="tel:+15551234567"
                      className="group flex items-center space-x-3 text-white/70 hover:text-white transition-colors duration-300"
                      whileHover={{ x: 4 }}
                    >
                      <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white transition-colors duration-300">
                        <span className="text-[10px]">📞</span>
                      </div>
                      <span className="text-[14px] font-light">+1 (555) 123-4567</span>
                    </motion.a>
                    <div className="flex items-start space-x-3 text-white/60">
                      <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center mt-0.5">
                        <span className="text-[10px]">📍</span>
                      </div>
                      <div className="text-[14px] font-light leading-[1.5]">
                    San Francisco, CA<br />
                    Innovation District
                      </div>
                    </div>
                </div>
              </div>

                {/* Social Links */}
                <div>
                  <h3 className="text-[16px] font-light text-white mb-[1.5rem] tracking-wide">
                    Follow Our Journey
                  </h3>
                  <div className="flex space-x-4">
                    {[
                      { name: "GitHub", href: "https://github.com", icon: "💻" },
                      { name: "LinkedIn", href: "https://linkedin.com", icon: "💼" },
                      { name: "Twitter", href: "https://twitter.com", icon: "🐦" },
                      { name: "Dribbble", href: "https://dribbble.com", icon: "🎨" }
                    ].map((social, index) => (
                      <motion.a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative"
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 hover:border-white transition-all duration-300">
                          <span className="text-[16px]">{social.icon}</span>
                        </div>
                      </motion.a>
                    ))}
                  </div>
            </div>

              </div>
            </motion.div>

            {/* Bottom Section */}
            <motion.div 
              className="border-t border-white/[0.06] pt-[1.5rem]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                
                {/* Copyright */}
                <p className="text-[13px] font-light text-white/40">
                  © 2024 Digital Studio Labs. All rights reserved.
                </p>
                
                {/* Legal Links */}
                <div className="flex flex-wrap gap-6">
                  {[
                    { name: "Privacy Policy", href: "/privacy" },
                    { name: "Terms of Service", href: "/terms" },
                    { name: "Cookies", href: "/cookies" }
                  ].map((link, index) => (
                    <motion.a 
                      key={index}
                      href={link.href} 
                      className="text-[13px] font-light text-white/40 hover:text-white/70 transition-colors duration-300"
                      whileHover={{ y: -1 }}
                    >
                      {link.name}
                    </motion.a>
                  ))}
                </div>
                
              </div>
            </motion.div>

          </div>

        </div>
      </section>

    </div>
  );
}
