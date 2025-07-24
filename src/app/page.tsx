'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
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
      // Skip spaces
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

        // Otherwise show a random character
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
      className={`h-[100px] flex justify-between items-center px-[4vw] bg-[#F8F9FA] cursor-pointer ${className}`}
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
              text-[clamp(14px,1.0vw,22px)] text-[#4A90E2] transition-all duration-100
              text-center
              ${isFirstLetter ? 'font-medium' : 'font-light'}
            `}
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
    src: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop&auto=format",
    alt: "Modern architecture",
    aspectRatio: "aspect-[4/3]", // landscape
    width: 800,
    height: 600,
  },
  {
    src: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=800&fit=crop&auto=format",
    alt: "Interior design",
    aspectRatio: "aspect-[3/4]", // portrait
    width: 600,
    height: 800,
  },
  {
    src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=450&fit=crop&auto=format",
    alt: "Minimalist design",
    aspectRatio: "aspect-[16/9]", // landscape
    width: 800,
    height: 450,
  },
  {
    src: "https://images.unsplash.com/photo-1586473219010-2ffc57b0d282?w=600&h=800&fit=crop&auto=format",
    alt: "Product design",
    aspectRatio: "aspect-[3/4]", // portrait
    width: 600,
    height: 800,
  },
  {
    src: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop&auto=format",
    alt: "Graphic design",
    aspectRatio: "aspect-[4/3]", // landscape
    width: 800,
    height: 600,
  },
  {
    src: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600&h=800&fit=crop&auto=format",
    alt: "UI design",
    aspectRatio: "aspect-[3/4]", // portrait
    width: 600,
    height: 800,
  },
  {
    src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=480&fit=crop&auto=format",
    alt: "Brand design",
    aspectRatio: "aspect-[5/3]", // landscape
    width: 800,
    height: 480,
  },
  {
    src: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop&auto=format",
    alt: "Web design",
    aspectRatio: "aspect-[4/3]", // landscape
    width: 800,
    height: 600,
  },
];

const RIGHT_COLUMN_IMAGES = [
  // Right column images (8 total, 2 portrait)
  {
    src: "https://images.unsplash.com/photo-1542744173-05336fcc7ad4?w=800&h=450&fit=crop&auto=format",
    alt: "Creative workspace",
    aspectRatio: "aspect-[16/9]", // landscape
    width: 800,
    height: 450,
  },
  {
    src: "https://images.unsplash.com/photo-1542744173-b6894b6b5d8d?w=600&h=800&fit=crop&auto=format",
    alt: "Design tools",
    aspectRatio: "aspect-[3/4]", // portrait
    width: 600,
    height: 800,
  },
  {
    src: "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800&h=600&fit=crop&auto=format",
    alt: "Typography",
    aspectRatio: "aspect-[4/3]", // landscape
    width: 800,
    height: 600,
  },
  {
    src: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&h=800&fit=crop&auto=format",
    alt: "Color palette",
    aspectRatio: "aspect-[3/4]", // portrait
    width: 600,
    height: 800,
  },
  {
    src: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&h=480&fit=crop&auto=format",
    alt: "Digital art",
    aspectRatio: "aspect-[5/3]", // landscape
    width: 800,
    height: 480,
  },
  {
    src: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&h=600&fit=crop&auto=format",
    alt: "Design process",
    aspectRatio: "aspect-[4/3]", // landscape
    width: 800,
    height: 600,
  },
  {
    src: "https://images.unsplash.com/photo-1600607687920-4f2c19665e92?w=800&h=450&fit=crop&auto=format",
    alt: "Creative concept",
    aspectRatio: "aspect-[16/9]", // landscape
    width: 800,
    height: 450,
  },
  {
    src: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&h=600&fit=crop&auto=format",
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

  React.useEffect(() => {
    const animate = () => {
      // Smooth infinite scrolling - left travels down slowly, right travels up 10% faster
      leftScrollY.current += 0.3; // scroll down slowly  
      rightScrollY.current -= 0.33; // scroll up 10% faster than left

      if (leftColumnRef.current) {
        const leftHeight = leftColumnRef.current.scrollHeight / 3; // Divide by 3 since we have triple images
        // Continuous loop using modulo for seamless transition
        leftScrollY.current = leftScrollY.current % leftHeight;
        leftColumnRef.current.style.transform = `translateY(-${leftScrollY.current}px)`;
      }

      if (rightColumnRef.current) {
        const rightHeight = rightColumnRef.current.scrollHeight / 3; // Divide by 3 since we have triple images
        // Continuous loop using modulo for seamless transition
        rightScrollY.current = ((rightScrollY.current % rightHeight) + rightHeight) % rightHeight;
        rightColumnRef.current.style.transform = `translateY(-${rightScrollY.current}px)`;
      }

      requestAnimationFrame(animate);
    };

    animate();
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
      // Get the DSL area position (responsive to screen size) - moved further from edge
      const dslAreaX = window.innerWidth <= 480 ? 60 : window.innerWidth <= 768 ? 80 : 120; // Further from edge
      const dslAreaY = window.innerWidth <= 480 ? 80 : window.innerWidth <= 768 ? 100 : 120; // Further from edge

      // Define the vertical DSL area (where stacked letters occupy) - larger area for better interaction
      const verticalDSLArea = {
        left: dslAreaX - 40, // Larger hover area
        right: dslAreaX + 40,
        top: dslAreaY - 20, // More forgiving hover area
        bottom: dslAreaY + 120, // Extended for 3 letters with comfortable spacing
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

    // Base stacked positions - properly spaced vertically (keeping current placement)
    const stackedPositions = [
      { x: 0, y: 0 },   // D at top (FIXED ANCHOR POINT)
      { x: 0, y: 80 },  // S in middle  
      { x: 0, y: 160 }  // L at bottom
    ];

    // Horizontal positions - D stays fixed, S and L move to align with D horizontally
    const horizontalPositions = [
      { x: 0, y: 0 },    // D NEVER MOVES - stays at anchor point
      { x: 80, y: 0 },   // S moves right and up to align with D 
      { x: 160, y: 0 }   // L moves right and up to align with D
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
    <div className="absolute left-[5rem] top-[5rem] z-30 
                    md:left-[5rem] md:top-[5rem]
                    sm:left-[3rem] sm:top-[3rem]
                    xs:left-[2rem] xs:top-[2rem]">
      <div className="relative w-[240px] h-[240px]">
        {letters.map((letter, index) => (
          <motion.div
            key={letter}
            className="absolute text-[clamp(48px,5vw,72px)] font-light text-white leading-none select-none cursor-pointer"
            style={{
              width: "70px",
              height: "70px", 
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

export default function Home() {
  const brandLetters = ['D', 'I', 'G', 'I', 'T', 'A', 'L', 'S', 'T', 'U', 'D', 'I', 'O', 'L', 'A', 'B', 'S'];

  const scrollToAboutMain = () => {
    const container = document.getElementById('about-horizontal-container');
    if (container) {
      // Scroll to the main About Us section (position 0 = main overview)
      container.scrollTo({ left: 0, behavior: 'smooth' });
    }
  };

  const scrollToAboutSection = (sectionId: string) => {
    const container = document.getElementById('about-horizontal-container');
    const detailContainer = document.querySelector('.about-detail-container');
    
    if (container && detailContainer) {
      // Map section IDs to vertical scroll positions
      const sectionMap: { [key: string]: number } = {
        'mission': 0,
        'approach': 1,
        'team': 2,
        'values': 3
      };
      const sectionIndex = sectionMap[sectionId] || 0;
      
      // Pre-position the vertical scroll to the target section
      detailContainer.scrollTo({
        top: sectionIndex * window.innerHeight,
        behavior: 'auto'
      });
      
      // Then smoothly scroll horizontally to reveal the positioned section
      container.scrollTo({ 
        left: window.innerWidth, 
        behavior: 'smooth' 
      });
    }
  };

  const scrollToCompaniesMain = () => {
    const container = document.getElementById('companies-horizontal-container');
    if (container) {
      // Scroll to the main Our Work section (position 1 = main overview on the right)
      container.scrollTo({ left: window.innerWidth, behavior: 'smooth' });
    }
  };

  const scrollToCompaniesSection = (sectionId: string) => {
    const container = document.getElementById('companies-horizontal-container');
    if (container) {
      // First scroll to the detail sections area (to the left)
      container.scrollTo({ left: 0, behavior: 'smooth' });
      
      // Then scroll to the specific section within the detail area (now vertical)
      setTimeout(() => {
        const detailContainer = document.getElementById('work-detail-scroll-container');
        if (detailContainer) {
          // Map section IDs to vertical scroll positions
          const sectionMap: { [key: string]: number } = {
            'portfolio': 0,
            'emerging-tech': 1,
            'creator-tools': 2,
            'innovation-labs': 3
          };
          const sectionIndex = sectionMap[sectionId] || 0;
          detailContainer.scrollTo({
            top: sectionIndex * window.innerHeight,
            behavior: 'smooth'
          });
          
          // Trigger navigation arrow setup after scroll
          setTimeout(() => {
            const handleWorkScroll = () => {
              const scrollTop = detailContainer.scrollTop;
              const sectionHeight = window.innerHeight;
              const currentSection = Math.round(scrollTop / sectionHeight);
              const upArrow = document.getElementById('work-nav-up');
              const downArrow = document.getElementById('work-nav-down');
              const backArrow = document.getElementById('work-nav-back');
              
                             if (upArrow && upArrow.parentElement) upArrow.parentElement.style.display = 'none';
               
               if (currentSection === 0 || currentSection === 1 || currentSection === 2) {
                 if (downArrow && downArrow.parentElement) downArrow.parentElement.style.display = 'flex';
                 if (backArrow && backArrow.parentElement) backArrow.parentElement.style.display = 'none';
               } else {
                 if (downArrow && downArrow.parentElement) downArrow.parentElement.style.display = 'none';
                 if (backArrow && backArrow.parentElement) backArrow.parentElement.style.display = 'flex';
               }
            };
            handleWorkScroll();
          }, 200);
        }
      }, 500);
    }
  };

  // About Us vertical scroll tracking with dynamic navigation
  useEffect(() => {
    const handleAboutScroll = () => {
      const container = document.querySelector('.about-detail-container');
      if (!container) return;

      const scrollTop = container.scrollTop;
      const sectionHeight = window.innerHeight;
      const currentSection = Math.round(scrollTop / sectionHeight);
      const totalSections = 4; // Mission, Approach, Team, Values
      
      // Update navigation arrows visibility based on flow
      const upArrow = document.getElementById('about-nav-up');
      const downArrow = document.getElementById('about-nav-down');
      const backArrow = document.getElementById('about-nav-back');
      
      console.log('About scroll - currentSection:', currentSection, 'scrollTop:', scrollTop);
      
      // Always hide up arrow (not needed in this flow)
      if (upArrow) upArrow.style.display = 'none';
      
      if (currentSection >= totalSections - 1) {
        // Last slide (Our Values): Only left arrow to go back to main section
        if (downArrow) downArrow.style.display = 'none';
        if (backArrow) backArrow.style.display = 'flex';
      } else {
        // All other slides (Mission, Our Approach, Our Team): Down arrow to continue
        if (downArrow) downArrow.style.display = 'flex';
        if (backArrow) backArrow.style.display = 'none';
      }
    };

    const container = document.querySelector('.about-detail-container');
    if (container) {
      container.addEventListener('scroll', handleAboutScroll);
      
      // Force initial setup after a brief delay to ensure DOM is ready
      setTimeout(() => {
        handleAboutScroll();
      }, 100);
      
      return () => {
        container.removeEventListener('scroll', handleAboutScroll);
      };
    }
  }, []);

  // Our Work vertical scroll tracking
  useEffect(() => {
    const handleWorkScroll = () => {
      const container = document.getElementById('work-detail-scroll-container');
      if (!container) return;

      const scrollTop = container.scrollTop;
      const sectionHeight = window.innerHeight;
      const currentSection = Math.round(scrollTop / sectionHeight);
      const totalSections = 4; // Portfolio, Emerging, Creator, Innovation

      // Update navigation arrows visibility based on flow
      const upArrow = document.getElementById('work-nav-up');
      const downArrow = document.getElementById('work-nav-down');
      const backArrow = document.getElementById('work-nav-back');
      
      console.log('Work scroll - currentSection:', currentSection, 'scrollTop:', scrollTop, 'sectionHeight:', sectionHeight);
      
      // Always hide up arrow (not needed in this flow)
      if (upArrow && upArrow.parentElement) {
        upArrow.parentElement.style.display = 'none';
      }
      
      // Force down arrow to be visible on first 3 slides
      if (currentSection === 0 || currentSection === 1 || currentSection === 2) {
        // Portfolio, Emerging Tech, Creator Tools: Show down arrow
        if (downArrow && downArrow.parentElement) {
          downArrow.parentElement.style.display = 'flex';
          console.log('Showing down arrow for section:', currentSection);
        }
        if (backArrow && backArrow.parentElement) {
          backArrow.parentElement.style.display = 'none';
        }
      } else {
        // Last slide (Innovation Labs): Only left arrow to go back to main section
        if (downArrow && downArrow.parentElement) {
          downArrow.parentElement.style.display = 'none';
          console.log('Hiding down arrow for last section:', currentSection);
        }
        if (backArrow && backArrow.parentElement) {
          backArrow.parentElement.style.display = 'flex';
        }
      }


    };

    const container = document.getElementById('work-detail-scroll-container');
    if (container) {
      container.addEventListener('scroll', handleWorkScroll);
      
      // Force initial setup with multiple attempts to ensure DOM is ready
      setTimeout(() => {
        handleWorkScroll();
      }, 100);
      
      setTimeout(() => {
        handleWorkScroll();
      }, 300);
      
      setTimeout(() => {
        handleWorkScroll();
      }, 500);
      
      return () => {
        container.removeEventListener('scroll', handleWorkScroll);
      };
    }
  }, []); // eslint-disable-next-line react-hooks/exhaustive-deps

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Ensure main sections are always the default view on page load
  useEffect(() => {
    const resetToMainSections = () => {
      // Reset About Us to main section (left = 0)
      const aboutContainer = document.getElementById('about-horizontal-container');
      if (aboutContainer) {
        aboutContainer.scrollLeft = 0;
      }
      
      // Reset Our Work to main section (right side)
      const workContainer = document.getElementById('companies-horizontal-container');
      if (workContainer) {
        workContainer.scrollLeft = window.innerWidth;
      }

      // Reset any detail scroll positions
      const aboutDetailContainer = document.querySelector('.about-detail-container');
      if (aboutDetailContainer) {
        aboutDetailContainer.scrollTop = 0;
      }

      const workDetailContainer = document.getElementById('work-detail-scroll-container');
      if (workDetailContainer) {
        workDetailContainer.scrollTop = 0;
      }
    };

    // Reset immediately
    resetToMainSections();

    // Also reset on window load (in case of browser restoration)
    window.addEventListener('load', resetToMainSections);
    
    // Reset on window resize to handle viewport changes
    window.addEventListener('resize', resetToMainSections);

    return () => {
      window.removeEventListener('load', resetToMainSections);
      window.removeEventListener('resize', resetToMainSections);
    };
  }, []);

  // Initialize About Us navigation arrows when entering detail sections
  useEffect(() => {
    const initializeAboutNavigation = () => {
      const upArrow = document.getElementById('about-nav-up');
      const downArrow = document.getElementById('about-nav-down');
      const backArrow = document.getElementById('about-nav-back');
      
      // Initial state: Mission section (first slide) - only down arrow
      if (upArrow) upArrow.style.display = 'none';
      if (downArrow) downArrow.style.display = 'flex';
      if (backArrow) backArrow.style.display = 'none';
    };

    // Initialize after component mount
    setTimeout(initializeAboutNavigation, 200);
  }, []);

  // Initialize Our Work navigation arrows when entering detail sections
  useEffect(() => {
    const initializeWorkNavigation = () => {
      const upArrow = document.getElementById('work-nav-up');
      const downArrow = document.getElementById('work-nav-down');
      const backArrow = document.getElementById('work-nav-back');
      
      console.log('Initializing work navigation arrows:', { upArrow, downArrow, backArrow });
      
      // Initial state: Portfolio section (first slide) - only down arrow
      if (upArrow && upArrow.parentElement) {
        upArrow.parentElement.style.display = 'none';
      }
      if (downArrow && downArrow.parentElement) {
        downArrow.parentElement.style.display = 'flex';
        console.log('Set down arrow to visible');
      }
      if (backArrow && backArrow.parentElement) {
        backArrow.parentElement.style.display = 'none';
      }
    };

    // Initialize after component mount with multiple attempts
    setTimeout(initializeWorkNavigation, 200);
    setTimeout(initializeWorkNavigation, 500);
    setTimeout(initializeWorkNavigation, 1000);
  }, []);

  return (
    <div className="scroll-container">
      
      {/* Section 1: Hero */}
      <section id="home" className="section-container bg-[#F8F9FA]">
        
        {/* Header Letters with Scoreboard Effect */}
        <ScoreboardHeader letters={brandLetters} />

        <div className="relative flex-1">
          
          {/* Main Headline - positioned exactly like reference */}
          <div className="absolute left-[4vw] top-[70px]">
            <h1 className="text-[clamp(38px,5.0vw,105px)] font-light leading-[1.1] text-[#4A90E2] max-w-[65vw]">
              We believe in the<br />
              value of what can&apos;t<br />
              be measured.
            </h1>
          </div>

          {/* Body Text Paragraph - positioned exactly like reference */}
          <div className="absolute right-[4vw] top-[390px] w-[min(380px,35vw)]">
            <p className="text-[15px] font-normal leading-[1.65] text-[#4A90E2] opacity-90">
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
              <li><a href="#home" className="text-[15px] font-normal text-[#4A90E2] hover:opacity-70 transition-opacity">Home</a></li>
              <li>
                <button 
                  onClick={scrollToCompaniesMain}
                  className="text-[15px] font-normal text-[#4A90E2] hover:opacity-70 transition-opacity"
                >
                  Companies
                </button>
              </li>
              <li>
                <button 
                  onClick={scrollToAboutMain}
                  className="text-[15px] font-normal text-[#4A90E2] hover:opacity-70 transition-opacity"
                >
                  About
                </button>
              </li>
              <li><a href="#contact" className="text-[15px] font-normal text-[#4A90E2] hover:opacity-70 transition-opacity">Contact</a></li>
            </ul>
          </nav>

        </div>
      </section>

      {/* Section 2: About Us with Horizontal Scroll */}
      <section id="about" className="section-container">
        <div id="about-horizontal-container" className="horizontal-scroll-container">
          
          {/* Main About Us Section */}
          <div className="horizontal-section bg-[#1a1a1a]">
            <div className="relative w-full h-full py-[4rem] px-[4vw] flex flex-col">
              
              {/* D/S/L Stacked Letters - Top Right */}
              <div className="absolute right-[3rem] top-[3rem] flex flex-col items-center space-y-2">
                <span className="text-[clamp(48px,5vw,72px)] font-light text-white leading-none">D</span>
                <span className="text-[clamp(48px,5vw,72px)] font-light text-white leading-none">S</span>
                <span className="text-[clamp(48px,5vw,72px)] font-light text-white leading-none">L</span>
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
                  <div className="border-b border-white/20 pb-[1.5rem] relative">
                    <button 
                      className="peer absolute bottom-[1.5rem] right-0 w-8 h-8 flex items-center justify-center text-[#4A90E2] hover:text-white transition-colors duration-300 cursor-pointer"
                      onClick={() => scrollToAboutSection('mission')}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <h3 className="text-[16px] font-medium text-[#4A90E2] peer-hover:text-white mb-[0.75rem] transition-colors duration-300">Our Mission</h3>
                    <p className="text-[14px] font-light text-white/90 leading-[1.5] pr-8">
                      To empower creators and innovators by building companies that 
                      challenge conventional thinking and celebrate human creativity.
                    </p>
                  </div>

                  {/* Our Approach */}
                  <div className="border-b border-white/20 pb-[1.5rem] relative">
                    <button 
                      className="peer absolute bottom-[1.5rem] right-0 w-8 h-8 flex items-center justify-center text-[#4A90E2] hover:text-white transition-colors duration-300 cursor-pointer"
                      onClick={() => scrollToAboutSection('approach')}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <h3 className="text-[16px] font-medium text-[#4A90E2] peer-hover:text-white mb-[0.75rem] transition-colors duration-300">Our Approach</h3>
                    <p className="text-[14px] font-light text-white/90 leading-[1.5] pr-8">
                      We combine deep technical expertise with creative vision, 
                      fostering environments where breakthrough ideas can flourish.
                    </p>
                  </div>

                  {/* Our Team */}
                  <div className="border-b border-white/20 pb-[1.5rem] relative">
                    <button 
                      className="peer absolute bottom-[1.5rem] right-0 w-8 h-8 flex items-center justify-center text-[#4A90E2] hover:text-white transition-colors duration-300 cursor-pointer"
                      onClick={() => scrollToAboutSection('team')}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <h3 className="text-[16px] font-medium text-[#4A90E2] peer-hover:text-white mb-[0.75rem] transition-colors duration-300">Our Team</h3>
                    <p className="text-[14px] font-light text-white/90 leading-[1.5] pr-8">
                      Authenticity, creativity, and community drive everything we do. 
                      We believe the best solutions emerge from diverse perspectives.
                    </p>
                  </div>

                  {/* Our Values */}
                  <div className="border-b border-white/20 pb-[1.5rem] relative">
                    <button 
                      className="peer absolute bottom-[1.5rem] right-0 w-8 h-8 flex items-center justify-center text-[#4A90E2] hover:text-white transition-colors duration-300 cursor-pointer"
                      onClick={() => scrollToAboutSection('values')}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <h3 className="text-[16px] font-medium text-[#4A90E2] peer-hover:text-white mb-[0.75rem] transition-colors duration-300">Our Values</h3>
                    <p className="text-[14px] font-light text-white/90 leading-[1.5] pr-8">
                      Building sustainable companies that create meaningful change 
                      in the creator economy and beyond.
                    </p>
                  </div>

                </div>
              </div>

            </div>
          </div>

          {/* About Detail Sections - Contained Vertical Scroll */}
          <div className="horizontal-section bg-[#1a1a1a]">
            <div className="about-detail-container">
              

              
              {/* Back Navigation - Right Center */}
              <div className="absolute right-8 top-1/2 transform -translate-y-1/2 z-30">
                <button
                  onClick={() => {
                    const mainSection = document.getElementById('about-horizontal-container');
                    if (mainSection) {
                      mainSection.scrollTo({ left: 0, behavior: 'smooth' });
                    }
                  }}
                  className="flex items-center justify-center text-white hover:text-blue-300 transition-all duration-300"
                  id="about-nav-back"
                >
                  <svg width="32" height="32" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              
              {/* Section 1: Our Mission Detail */}
              <div 
                id="about-mission" 
                className="about-detail-section bg-[#1a1a1a]"
              >
                <div className="relative w-full h-full py-[4rem] px-[4vw] flex flex-col justify-center">
                  


                  {/* Down Navigation - Bottom Center */}
                  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50">
                    <button
                      onClick={() => {
                        const container = document.querySelector('.about-detail-container');
                        if (container) {
                          container.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
                        }
                      }}
                      className="flex items-center justify-center text-white hover:text-blue-300 transition-all duration-300"
                    >
                      <svg width="32" height="32" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M3 6L8 11L13 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>

                  {/* Content Center */}
                  <div className="flex flex-col items-center justify-center text-center max-w-[900px] mx-auto">
                    <h2 className="text-[clamp(48px,8vw,120px)] font-light text-[#4A90E2] mb-8">Our Mission</h2>
                    <p className="text-[clamp(18px,2.5vw,32px)] font-light text-white/90 leading-[1.5] mb-12">
                      To empower creators and innovators by building companies that challenge conventional thinking and celebrate human creativity.
                    </p>

                  </div>
                </div>
              </div>

              {/* Section 2: Our Approach Detail */}
              <div 
                id="about-approach" 
                className="about-detail-section bg-[#4A90E2]"
              >
                <div className="relative w-full h-full py-[4rem] px-[4vw] flex flex-col justify-center">
                  
                  {/* D/S/L Stacked Letters - Bottom Left */}
                  <div className="absolute left-[3rem] bottom-[3rem] flex flex-col items-center space-y-2">
                    <span className="text-[clamp(48px,5vw,72px)] font-light text-[#F8F9FA] leading-none">D</span>
                    <span className="text-[clamp(48px,5vw,72px)] font-light text-[#F8F9FA] leading-none">S</span>
                    <span className="text-[clamp(48px,5vw,72px)] font-light text-[#F8F9FA] leading-none">L</span>
                  </div>

                  {/* Down Navigation - Bottom Center */}
                  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50">
                    <button
                      onClick={() => {
                        const container = document.querySelector('.about-detail-container');
                        if (container) {
                          container.scrollTo({ top: 2 * window.innerHeight, behavior: 'smooth' });
                        }
                      }}
                      className="flex items-center justify-center text-white hover:text-blue-300 transition-all duration-300"
                    >
                      <svg width="32" height="32" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M3 6L8 11L13 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>

                  {/* Content Center */}
                  <div className="flex flex-col items-center justify-center text-center max-w-[900px] mx-auto">
                    <h2 className="text-[clamp(48px,8vw,120px)] font-light text-[#F8F9FA] mb-8">Our Approach</h2>
                    <p className="text-[clamp(18px,2.5vw,32px)] font-light text-white/90 leading-[1.5] mb-12">
                      We combine deep technical expertise with creative vision, fostering environments where breakthrough ideas can flourish.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 3: Our Team Detail */}
              <div 
                id="about-team" 
                className="about-detail-section bg-white"
              >
                <div className="relative w-full h-full py-[4rem] px-[4vw] flex flex-col justify-center">
                  
                  {/* Down Navigation - Bottom Center */}
                  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50">
                    <button
                      onClick={() => {
                        const container = document.querySelector('.about-detail-container');
                        if (container) {
                          container.scrollTo({ top: 3 * window.innerHeight, behavior: 'smooth' });
                        }
                      }}
                      className="flex items-center justify-center text-[#4A90E2] hover:text-blue-600 transition-all duration-300"
                    >
                      <svg width="32" height="32" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M3 6L8 11L13 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>

                  {/* Content Center */}
                  <div className="flex flex-col items-center justify-center text-center max-w-[900px] mx-auto">
                    <h2 className="text-[clamp(48px,8vw,120px)] font-light text-[#4A90E2] mb-8">Our Team</h2>
                    <p className="text-[clamp(18px,2.5vw,32px)] font-light text-black/80 leading-[1.5] mb-12">
                      Authenticity, creativity, and community drive everything we do. We believe the best solutions emerge from diverse perspectives.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 4: Our Values Detail - Final Section */}
              <div 
                id="about-values" 
                className="about-detail-section bg-[#1a1a1a]"
              >
                <div className="relative w-full h-full py-[4rem] px-[4vw] flex flex-col justify-center">
                  


                  {/* Back Navigation - Left Center */}
                  <div className="absolute left-8 top-1/2 transform -translate-y-1/2 z-50">
                    <button
                      onClick={() => {
                        const mainSection = document.getElementById('about-horizontal-container');
                        if (mainSection) {
                          mainSection.scrollTo({ left: 0, behavior: 'smooth' });
                        }
                      }}
                      className="flex items-center justify-center text-white hover:text-blue-300 transition-all duration-300"
                    >
                      <svg width="32" height="32" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>

                  {/* Content Center */}
                  <div className="flex flex-col items-center justify-center text-center max-w-[900px] mx-auto">
                    <h2 className="text-[clamp(48px,8vw,120px)] font-light text-[#4A90E2] mb-8">Our Values</h2>
                    <p className="text-[clamp(18px,2.5vw,32px)] font-light text-white/90 leading-[1.5] mb-12">
                      Building sustainable companies that create meaningful change in the creator economy and beyond.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Section 3: Our Work with Horizontal Scroll */}
      <section id="companies" className="section-container">
        <div id="companies-horizontal-container" className="horizontal-scroll-container">
          
          {/* Our Work Detail Sections - Now positioned left (first) */}
          <div className="horizontal-section bg-[#4A90E2]">
            <div className="work-detail-container" id="work-detail-scroll-container">
              

              

              
              {/* Section 1: Portfolio Companies Detail */}
              <div 
                id="companies-portfolio" 
                className="work-detail-section bg-[#1a1a1a]"
              >
                <div className="relative w-full h-full py-[4rem] px-[4vw] flex flex-col justify-center">
                  
                  {/* Down Navigation - Bottom Center */}
                  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50">
                    <button
                      onClick={() => {
                        const container = document.getElementById('work-detail-scroll-container');
                        if (container) {
                          container.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
                        }
                      }}
                      className="flex items-center justify-center text-white hover:text-blue-300 transition-all duration-300"
                    >
                      <svg width="32" height="32" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M3 6L8 11L13 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                  


                  {/* Content Center */}
                  <div className="flex flex-col items-center justify-center text-center max-w-[900px] mx-auto">
                    <h2 className="text-[clamp(48px,8vw,120px)] font-light text-[#4A90E2] mb-8">Portfolio Companies</h2>
                    <p className="text-[clamp(18px,2.5vw,32px)] font-light text-white/90 leading-[1.5] mb-12">
                      Building and investing in innovative startups that are reshaping industries and creating the future of technology.
                    </p>

                  </div>
                </div>
              </div>

              {/* Section 2: Emerging Tech Detail */}
              <div 
                id="companies-emerging-tech" 
                className="work-detail-section bg-white"
              >
                <div className="relative w-full h-full py-[4rem] px-[4vw] flex flex-col justify-center">
                  
                  {/* Down Navigation - Bottom Center */}
                  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50">
                    <button
                      onClick={() => {
                        const container = document.getElementById('work-detail-scroll-container');
                        if (container) {
                          container.scrollTo({ top: 2 * window.innerHeight, behavior: 'smooth' });
                        }
                      }}
                      className="flex items-center justify-center text-[#4A90E2] hover:text-blue-600 transition-all duration-300"
                    >
                      <svg width="32" height="32" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M3 6L8 11L13 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                  
                  {/* Content Center */}
                  <div className="flex flex-col items-center justify-center text-center max-w-[900px] mx-auto">
                    <h2 className="text-[clamp(48px,8vw,120px)] font-light text-[#4A90E2] mb-8">Emerging Tech</h2>
                    <p className="text-[clamp(18px,2.5vw,32px)] font-light text-black/80 leading-[1.5] mb-12">
                      Exploring cutting-edge technologies like AI, blockchain, and quantum computing to unlock new possibilities.
                    </p>

                  </div>
                </div>
              </div>

              {/* Section 3: Creator Tools Detail */}
              <div 
                id="companies-creator-tools" 
                className="work-detail-section bg-[#4A90E2]"
              >
                <div className="relative w-full h-full py-[4rem] px-[4vw] flex flex-col justify-center">
                  
                  {/* Down Navigation - Bottom Center */}
                  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50">
                    <button
                      onClick={() => {
                        const container = document.getElementById('work-detail-scroll-container');
                        if (container) {
                          container.scrollTo({ top: 3 * window.innerHeight, behavior: 'smooth' });
                        }
                      }}
                      className="flex items-center justify-center text-white hover:text-blue-200 transition-all duration-300"
                    >
                      <svg width="32" height="32" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M3 6L8 11L13 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                  


                  {/* Content Center */}
                  <div className="flex flex-col items-center justify-center text-center max-w-[900px] mx-auto">
                    <h2 className="text-[clamp(48px,8vw,120px)] font-light text-[#F8F9FA] mb-8">Creator Tools</h2>
                    <p className="text-[clamp(18px,2.5vw,32px)] font-light text-white/90 leading-[1.5] mb-12">
                      Developing platforms and tools that empower creators to build, monetize, and scale their creative endeavors.
                    </p>

                  </div>
                </div>
              </div>

              {/* Section 4: Innovation Labs Detail - Final Section */}
              <div 
                id="companies-innovation-labs" 
                className="work-detail-section bg-[#1a1a1a]"
              >
                <div className="relative w-full h-full py-[4rem] px-[4vw] flex flex-col justify-center">
                  
                  {/* Back Navigation - Right Center */}
                  <div className="absolute right-8 top-1/2 transform -translate-y-1/2 z-50">
                    <button
                      onClick={() => {
                        const mainSection = document.getElementById('companies-horizontal-container');
                        if (mainSection) {
                          mainSection.scrollTo({ left: window.innerWidth, behavior: 'smooth' });
                        }
                      }}
                      className="flex items-center justify-center text-white hover:text-blue-300 transition-all duration-300"
                    >
                      <svg width="32" height="32" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                  


                  {/* Content Center */}
                  <div className="flex flex-col items-center justify-center text-center max-w-[900px] mx-auto">
                    <h2 className="text-[clamp(48px,8vw,120px)] font-light text-[#4A90E2] mb-8">Innovation Labs</h2>
                    <p className="text-[clamp(18px,2.5vw,32px)] font-light text-white/90 leading-[1.5] mb-12">
                      Experimental projects and research initiatives that push the boundaries of what&apos;s possible in technology.
                    </p>

                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Main Our Work Section - Now positioned right (second) */}
          <div className="horizontal-section bg-[#4A90E2]">
            <div className="relative w-full h-full py-[4rem] px-[4vw] flex flex-col">
              


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
                  <div className="border-b border-white/20 pb-[1.5rem] relative">
                    <button 
                      className="peer absolute bottom-[1.5rem] left-0 w-8 h-8 flex items-center justify-center text-[#F8F9FA] hover:text-black transition-colors duration-300 cursor-pointer"
                      onClick={() => scrollToCompaniesSection('portfolio')}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <h3 className="text-[16px] font-medium text-[#F8F9FA] mb-[0.75rem] text-right transition-colors duration-300 peer-hover:text-black">Portfolio Companies</h3>
                    <p className="text-[14px] font-light text-white/90 leading-[1.5] pl-8 text-right">
                      Building and investing in innovative startups that are reshaping 
                      industries and creating the future of technology.
                    </p>
                  </div>

                  {/* Emerging Tech */}
                  <div className="border-b border-white/20 pb-[1.5rem] relative">
                    <button 
                      className="peer absolute bottom-[1.5rem] left-0 w-8 h-8 flex items-center justify-center text-[#F8F9FA] hover:text-black transition-colors duration-300 cursor-pointer"
                      onClick={() => scrollToCompaniesSection('emerging-tech')}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <h3 className="text-[16px] font-medium text-[#F8F9FA] mb-[0.75rem] text-right transition-colors duration-300 peer-hover:text-black">Emerging Tech</h3>
                    <p className="text-[14px] font-light text-white/90 leading-[1.5] pl-8 text-right">
                      Exploring cutting-edge technologies like AI, blockchain, and 
                      quantum computing to unlock new possibilities.
                    </p>
                  </div>

                  {/* Creator Tools */}
                  <div className="border-b border-white/20 pb-[1.5rem] relative">
                    <button 
                      className="peer absolute bottom-[1.5rem] left-0 w-8 h-8 flex items-center justify-center text-[#F8F9FA] hover:text-black transition-colors duration-300 cursor-pointer"
                      onClick={() => scrollToCompaniesSection('creator-tools')}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <h3 className="text-[16px] font-medium text-[#F8F9FA] mb-[0.75rem] text-right transition-colors duration-300 peer-hover:text-black">Creator Tools</h3>
                    <p className="text-[14px] font-light text-white/90 leading-[1.5] pl-8 text-right">
                      Developing platforms and tools that empower creators to build, 
                      monetize, and scale their creative endeavors.
                    </p>
                  </div>

                  {/* Innovation Labs */}
                  <div className="border-b border-white/20 pb-[1.5rem] relative">
                    <button 
                      className="peer absolute bottom-[1.5rem] left-0 w-8 h-8 flex items-center justify-center text-[#F8F9FA] hover:text-black transition-colors duration-300 cursor-pointer"
                      onClick={() => scrollToCompaniesSection('innovation-labs')}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <h3 className="text-[16px] font-medium text-[#F8F9FA] mb-[0.75rem] text-right transition-colors duration-300 peer-hover:text-black">Innovation Labs</h3>
                    <p className="text-[14px] font-light text-white/90 leading-[1.5] pl-8 text-right">
                      Experimental projects and research initiatives that push the 
                      boundaries of what&apos;s possible in technology.
                    </p>
                  </div>

                   </div>
                 </div>
               </div>

            </div>
          </div>

        </div>
      </section>

      {/* Section 4: Contact/Partnership */}
      <section id="contact" className="section-container bg-white">
        <div className="relative w-full h-full py-[4rem] px-[4vw] flex flex-col">
          
          {/* D/S/L Stacked Letters - Bottom Right (matching other sections) */}
          <div className="absolute right-[3rem] bottom-[3rem] flex flex-col items-center space-y-2 z-20
                          md:right-[3rem] md:bottom-[3rem]
                          sm:right-[2rem] sm:bottom-[2rem]
                          xs:right-[1rem] xs:bottom-[1rem]">
            <DSLLetter letter="D" />
            <DSLLetter letter="S" />
            <DSLLetter letter="L" />
          </div>

          {/* Main Content - Mobile Responsive Layout */}
          <div className="absolute left-[4vw] top-[12rem] 
                          md:left-[4vw] md:top-[12rem] md:max-w-[35vw]
                          sm:left-[4vw] sm:top-[8rem] sm:max-w-[85vw]
                          xs:left-[4vw] xs:top-[6rem] xs:max-w-[90vw]">
            <div className="max-w-[35vw] md:max-w-[35vw] sm:max-w-[85vw] xs:max-w-[90vw]">
              
              {/* Animated Headline */}
              <div className="mb-[3rem] h-[80px] relative 
                              md:mb-[3rem] md:h-[80px]
                              sm:mb-[2rem] sm:h-[60px]
                              xs:mb-[1.5rem] xs:h-[50px]">
                <ProximityGradientText
                  colors={["#3b82f6", "#ec4899", "#fbbf24", "#3b82f6"]}
                  proximityRadius={500}
                >
                  LET&apos;S CREATE
                </ProximityGradientText>
              </div>

              {/* Supporting Text */}
              <div className="space-y-[2rem] max-w-[320px] 
                              md:space-y-[2rem] md:max-w-[320px]
                              sm:space-y-[1.5rem] sm:max-w-[100%]
                              xs:space-y-[1rem] xs:max-w-[100%]">
                <p className="text-[16px] font-light text-black/80 leading-[1.6]
                              md:text-[16px]
                              sm:text-[15px]
                              xs:text-[14px]">
                  Ready to build something extraordinary? We partner with visionary founders 
                  and companies to create digital experiences that redefine what&apos;s possible.
                </p>
                
                <p className="text-[16px] font-light text-black/80 leading-[1.6]
                              md:text-[16px]
                              sm:text-[15px]
                              xs:text-[14px]">
                  From startups to Fortune 500 enterprises, we bring together strategic 
                  thinking, cutting-edge technology, and exceptional design to transform 
                  ambitious ideas into reality.
                </p>
                
                <div className="space-y-[1rem]
                                md:space-y-[1rem]
                                sm:space-y-[0.75rem]
                                xs:space-y-[0.5rem]">
                  <p className="text-[14px] font-medium text-black
                                md:text-[14px]
                                sm:text-[13px]
                                xs:text-[12px]">
                    Start the conversation
                  </p>
                  <a 
                    href="mailto:hello@digitalstudiolabs.com"
                    className="text-[14px] font-normal text-black/70 hover:text-black transition-colors duration-300 border-b border-black/20 hover:border-black/40
                              md:text-[14px]
                              sm:text-[13px]
                              xs:text-[12px]"
                  >
                    hello@digitalstudiolabs.com
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* Dynamic Image Mosaic - Extending to section edges */}
          <div className="absolute left-[45vw] top-0 bottom-0 w-[550px] z-10 overflow-hidden
                          lg:left-[45vw] lg:w-[550px]
                          md:left-[42vw] md:w-[480px] md:top-0 md:bottom-0
                          sm:left-[38vw] sm:w-[400px] sm:top-0 sm:bottom-0
                          xs:hidden"
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

        <div className="relative w-full h-full py-[6rem] px-[4vw] flex flex-col">
          
          {/* D/S/L Animated Letters - Top Left */}
          <DSLAnimation />

          {/* Animated Welcome Section */}
          <motion.div 
            className="mt-[8rem] mb-[6rem] text-center"
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
              <h2 className="text-[clamp(36px,5vw,72px)] font-light leading-[1.1] text-white mb-[2rem] tracking-wide">
                Let&apos;s Create
                <motion.span 
                  className="text-[#4A90E2] ml-4"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.8, type: "spring" }}
                  viewport={{ once: true }}
                >
                  Together
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
              className="grid grid-cols-1 lg:grid-cols-12 gap-[4rem] lg:gap-[6rem] mb-[6rem]"
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
                <div className="space-y-[3rem]">
                  <div>
                    <h3 className="text-[clamp(24px,3vw,32px)] font-light text-white mb-[1.5rem] tracking-wide">
                      Digital Studio Labs
                    </h3>
                    <p className="text-[15px] font-light text-white/70 leading-[1.6] max-w-[420px]">
                      We believe in the power of creativity and innovation to transform industries and inspire meaningful change in the creator economy.
                    </p>
                  </div>

                  {/* Newsletter Signup */}
                  <div className="space-y-[1.5rem]">
                    <h4 className="text-[18px] font-light text-white tracking-wide">
                      Stay in the Loop
                    </h4>
                    <div className="relative group max-w-[400px]">
                      <input
                        type="email"
                        placeholder="Enter your email address"
                        className="w-full bg-transparent border border-white/20 rounded-none px-4 py-3 text-white placeholder:text-white/40 text-[14px] font-light focus:outline-none focus:border-[#4A90E2] transition-all duration-300"
                      />
                      <motion.button
                        className="absolute right-0 top-0 h-full px-6 bg-[#4A90E2] text-white text-[14px] font-light hover:bg-[#357ABD] transition-all duration-300"
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-[3rem]">
                  
                  {/* Services */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    viewport={{ once: true }}
                  >
                    <h3 className="text-[14px] font-medium text-[#4A90E2] mb-[2rem] tracking-wide uppercase">
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
                            <span className="w-0 h-[1px] bg-[#4A90E2] group-hover:w-4 transition-all duration-300 mr-0 group-hover:mr-2"></span>
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
                    <h3 className="text-[14px] font-medium text-[#4A90E2] mb-[2rem] tracking-wide uppercase">
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
                            <span className="w-0 h-[1px] bg-[#4A90E2] group-hover:w-4 transition-all duration-300 mr-0 group-hover:mr-2"></span>
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
                    <h3 className="text-[14px] font-medium text-[#4A90E2] mb-[2rem] tracking-wide uppercase">
                      Company
                    </h3>
                    <div className="space-y-[1.2rem]">
                      {[
                        { name: "About Us", href: "/about" },
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
                            <span className="w-0 h-[1px] bg-[#4A90E2] group-hover:w-4 transition-all duration-300 mr-0 group-hover:mr-2"></span>
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
              className="border-t border-white/[0.08] pt-[3rem] mb-[3rem]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-[3rem] lg:gap-[6rem]">
                
                {/* Contact Info */}
                <div>
                  <h3 className="text-[18px] font-light text-white mb-[2rem] tracking-wide">
                    Connect With Us
                  </h3>
                  <div className="space-y-[1.5rem]">
                    <motion.a
                      href="mailto:hello@digitalstudiolabs.com"
                      className="group flex items-center space-x-3 text-white/70 hover:text-[#4A90E2] transition-colors duration-300"
                      whileHover={{ x: 4 }}
                    >
                      <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center group-hover:border-[#4A90E2] transition-colors duration-300">
                        <span className="text-[10px]">@</span>
                      </div>
                      <span className="text-[14px] font-light">hello@digitalstudiolabs.com</span>
                    </motion.a>
                    <motion.a
                      href="tel:+15551234567"
                      className="group flex items-center space-x-3 text-white/70 hover:text-[#4A90E2] transition-colors duration-300"
                      whileHover={{ x: 4 }}
                    >
                      <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center group-hover:border-[#4A90E2] transition-colors duration-300">
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
                  <h3 className="text-[18px] font-light text-white mb-[2rem] tracking-wide">
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
                        <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-[#4A90E2] hover:border-[#4A90E2] transition-all duration-300">
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
              className="border-t border-white/[0.06] pt-[2rem]"
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
