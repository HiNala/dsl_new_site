'use client';

import React, { useState, useEffect } from 'react';
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
      <h2 className="text-[clamp(72px,9vw,140px)] font-light leading-[1.0] tracking-tighter text-left text-black relative z-10">
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
          className="text-[clamp(72px,9vw,140px)] font-light leading-[1.0] tracking-tighter text-left text-transparent"
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

interface ImageMosaicProps {
  className?: string;
}

const DESIGN_IMAGES = [
  // Left column images (8 total, 3 portrait)
  {
    src: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop",
    alt: "Modern architecture",
    aspectRatio: "aspect-[4/3]", // landscape
    width: 800,
    height: 600,
  },
  {
    src: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=800&fit=crop",
    alt: "Interior design",
    aspectRatio: "aspect-[3/4]", // portrait
    width: 600,
    height: 800,
  },
  {
    src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=450&fit=crop",
    alt: "Minimalist design",
    aspectRatio: "aspect-[16/9]", // landscape
    width: 800,
    height: 450,
  },
  {
    src: "https://images.unsplash.com/photo-1586473219010-2ffc57b0d282?w=600&h=800&fit=crop",
    alt: "Product design",
    aspectRatio: "aspect-[3/4]", // portrait
    width: 600,
    height: 800,
  },
  {
    src: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop",
    alt: "Graphic design",
    aspectRatio: "aspect-[4/3]", // landscape
    width: 800,
    height: 600,
  },
  {
    src: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600&h=800&fit=crop",
    alt: "UI design",
    aspectRatio: "aspect-[3/4]", // portrait
    width: 600,
    height: 800,
  },
  {
    src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=480&fit=crop",
    alt: "Brand design",
    aspectRatio: "aspect-[5/3]", // landscape
    width: 800,
    height: 480,
  },
  {
    src: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop",
    alt: "Web design",
    aspectRatio: "aspect-[4/3]", // landscape
    width: 800,
    height: 600,
  },
];

const RIGHT_COLUMN_IMAGES = [
  // Right column images (8 total, 2 portrait)
  {
    src: "https://images.unsplash.com/photo-1542744173-05336fcc7ad4?w=800&h=450&fit=crop",
    alt: "Creative workspace",
    aspectRatio: "aspect-[16/9]", // landscape
    width: 800,
    height: 450,
  },
  {
    src: "https://images.unsplash.com/photo-1542744173-b6894b6b5d8d?w=600&h=800&fit=crop",
    alt: "Design tools",
    aspectRatio: "aspect-[3/4]", // portrait
    width: 600,
    height: 800,
  },
  {
    src: "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800&h=600&fit=crop",
    alt: "Typography",
    aspectRatio: "aspect-[4/3]", // landscape
    width: 800,
    height: 600,
  },
  {
    src: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&h=800&fit=crop",
    alt: "Color palette",
    aspectRatio: "aspect-[3/4]", // portrait
    width: 600,
    height: 800,
  },
  {
    src: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&h=480&fit=crop",
    alt: "Digital art",
    aspectRatio: "aspect-[5/3]", // landscape
    width: 800,
    height: 480,
  },
  {
    src: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&h=600&fit=crop",
    alt: "Design process",
    aspectRatio: "aspect-[4/3]", // landscape
    width: 800,
    height: 600,
  },
  {
    src: "https://images.unsplash.com/photo-1600607687920-4f2c19665e92?w=800&h=450&fit=crop",
    alt: "Creative concept",
    aspectRatio: "aspect-[16/9]", // landscape
    width: 800,
    height: 450,
  },
  {
    src: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&h=600&fit=crop",
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
      leftScrollY.current -= 0.3; // scroll up slowly  
      rightScrollY.current += 0.33; // scroll down 10% faster than left

      if (leftColumnRef.current) {
        const leftHeight = leftColumnRef.current.scrollHeight / 2;
        // Continuous loop using modulo for seamless transition
        leftScrollY.current = ((leftScrollY.current % leftHeight) + leftHeight) % leftHeight;
        leftColumnRef.current.style.transform = `translateY(-${leftScrollY.current}px)`;
      }

      if (rightColumnRef.current) {
        const rightHeight = rightColumnRef.current.scrollHeight / 2;
        // Continuous loop using modulo for seamless transition
        rightScrollY.current = rightScrollY.current % rightHeight;
        rightColumnRef.current.style.transform = `translateY(-${rightScrollY.current}px)`;
      }

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return (
    <div className={cn("w-full h-full overflow-hidden bg-transparent", className)}>
      <div className="flex h-full gap-4">
        {/* Left Column - Scrolling Up */}
        <div className="w-1/2 overflow-hidden">
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
                  "w-full"
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

        {/* Right Column - Scrolling Down */}
        <div className="w-1/2 overflow-hidden">
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
                  "w-full"
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
      // Get the DSL area position (updated for new positioning)
      const dslAreaX = window.innerWidth * 0.02; // 2vw
      const dslAreaY = 256; // 16rem = 256px

      // Define the vertical DSL area (where stacked letters occupy)
      const verticalDSLArea = {
        left: dslAreaX - 80, // Wider area for easier interaction
        right: dslAreaX + 80,
        top: dslAreaY - 120, // Extended up to encompass all letters with new spacing
        bottom: dslAreaY + 220, // Extended down for better hover detection
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

    // Invisible baseline - bottom of letters when horizontal
    const baseline = -240;

    // Base stacked positions with proper spacing to match screenshot (100px between letters)
    const stackedY = (2 - letterIndex) * -100; // D at -200, S at -100, L at 0
    const baseX = 0;

    // Ensure no letter goes below baseline
    const respectBaseline = (y: number) => Math.max(baseline, y);

    // Animation stages
    if (stage === 0) {
      // Initial stacked position
      return { x: baseX, y: stackedY, rotate: 0 };
    }

    // Animation sequence positions for each letter - matching 100px horizontal spacing
    const letterAnimations = [
      {
        // D positions through animation - stays in original X position
        fall1: { x: baseX, y: stackedY + 20, rotate: -2 }, // Gentler start
        fall2: { x: baseX, y: respectBaseline(baseline + 10), rotate: -0.5 }, // Smoother fall
        bounce: { x: baseX, y: respectBaseline(baseline - 3), rotate: 0.2 }, // Subtle bounce
        final: { x: baseX, y: respectBaseline(baseline), rotate: 0 }, // Settle in original X position
      },
      {
        // S positions through animation - moves to align with D (100px spacing)
        fall1: { x: -2, y: stackedY + 15, rotate: 2 }, // Gentler start
        fall2: { x: 30, y: respectBaseline(baseline + 8), rotate: 1 }, // Gradual horizontal movement
        bounce: { x: 95, y: respectBaseline(baseline - 2), rotate: -0.5 }, // Near final position
        final: { x: 100, y: respectBaseline(baseline), rotate: 0 }, // 100px spacing from D
      },
      {
        // L positions through animation - moves to align with D and S (100px spacing each)
        fall1: { x: 3, y: stackedY + 18, rotate: -3 }, // Gentler start
        fall2: { x: 80, y: respectBaseline(baseline + 12), rotate: -1.5 }, // Gradual horizontal movement
        bounce: { x: 195, y: respectBaseline(baseline - 2.5), rotate: 1 }, // Near final position
        final: { x: 200, y: respectBaseline(baseline), rotate: 0 }, // 200px from D (100px from S)
      },
    ];

    const letterAnim = letterAnimations[letterIndex];

    if (stage === 1) return letterAnim.fall1;
    if (stage === 2) return letterAnim.fall2;
    if (stage === 3) return letterAnim.bounce;
    if (stage === 4) {
      // Very subtle continuous movement in final position
      const bounceOffset = Math.sin(Date.now() * 0.003 + letterIndex) * 0.5;
      return {
        x: letterAnim.final.x + bounceOffset * 0.05,
        y: letterAnim.final.y + Math.abs(bounceOffset) * 0.05,
        rotate: letterAnim.final.rotate,
      };
    }

    // Default fallback
    return { x: baseX, y: stackedY, rotate: 0 };
  };

  const letters = ["D", "S", "L"];

  return (
    <div className="absolute left-[1.5rem] top-[1.5rem] z-20">
      <div className="relative">
        {letters.map((letter, index) => (
          <motion.div
            key={letter}
            className="absolute text-[clamp(72px,9vw,140px)] font-light text-white leading-none select-none"
            style={{
              width: "120px",
              height: "120px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: "translate(-50%, -50%)",
            }}
            animate={getLetterAnimation(index, currentStage)}
            transition={{
              type: "spring",
              stiffness: 60, // Reduced for smoother animation
              damping: 25, // Reduced for less bounce
              duration: 0.8, // Slightly longer for smoothness
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

  const scrollToAboutSection = (sectionId: string) => {
    const container = document.getElementById('about-horizontal-container');
    if (container) {
      container.scrollTo({ left: window.innerWidth, behavior: 'smooth' });
      
      // Then scroll to the specific section within the detail area
      setTimeout(() => {
        const targetSection = document.getElementById(`about-${sectionId}`);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
    }
  };

  const scrollToCompaniesSection = (sectionId: string) => {
    const container = document.getElementById('companies-horizontal-container');
    if (container) {
      container.scrollTo({ left: window.innerWidth, behavior: 'smooth' });
      
      // Then scroll to the specific section within the detail area
      setTimeout(() => {
        const detailContainer = document.querySelector('.work-detail-container');
        const targetSection = document.getElementById(`companies-${sectionId}`);
        if (detailContainer && targetSection) {
          // Map section IDs to horizontal scroll positions
          const sectionMap: { [key: string]: number } = {
            'portfolio': 0,
            'emerging-tech': 1,
            'creator-tools': 2,
            'innovation-labs': 3
          };
          const sectionIndex = sectionMap[sectionId] || 0;
          detailContainer.scrollTo({
            left: sectionIndex * window.innerWidth,
            behavior: 'smooth'
          });
        }
      }, 500);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
              <li><a href="#companies" className="text-[15px] font-normal text-[#4A90E2] hover:opacity-70 transition-opacity">Companies</a></li>
              <li><a href="#about" className="text-[15px] font-normal text-[#4A90E2] hover:opacity-70 transition-opacity">About</a></li>
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
              <div className="absolute right-[1.5rem] top-[1.5rem] flex flex-col items-center space-y-3">
                <span className="text-[clamp(72px,9vw,140px)] font-light text-[#4A90E2] leading-none">D</span>
                <span className="text-[clamp(72px,9vw,140px)] font-light text-[#4A90E2] leading-none">S</span>
                <span className="text-[clamp(72px,9vw,140px)] font-light text-[#4A90E2] leading-none">L</span>
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
              
              {/* Section 1: Our Mission Detail */}
              <div 
                id="about-mission" 
                className="about-detail-section bg-[#1a1a1a]"
              >
                <div className="relative w-full h-full py-[4rem] px-[4vw] flex flex-col justify-center">
                  
                  {/* D/S/L Stacked Letters - Top Right */}
                  <div className="absolute right-[1.5rem] top-[1.5rem] flex flex-col items-center space-y-3">
                    <span className="text-[clamp(72px,9vw,140px)] font-light text-[#4A90E2] leading-none">D</span>
                    <span className="text-[clamp(72px,9vw,140px)] font-light text-[#4A90E2] leading-none">S</span>
                    <span className="text-[clamp(72px,9vw,140px)] font-light text-[#4A90E2] leading-none">L</span>
                  </div>

                  {/* Content Center */}
                  <div className="flex flex-col items-center justify-center text-center max-w-[900px] mx-auto">
                    <h2 className="text-[clamp(48px,8vw,120px)] font-light text-[#4A90E2] mb-8">Our Mission</h2>
                    <p className="text-[clamp(18px,2.5vw,32px)] font-light text-white/90 leading-[1.5] mb-12">
                      To empower creators and innovators by building companies that challenge conventional thinking and celebrate human creativity.
                    </p>
                    <div className="text-white/50 text-sm flex space-x-8">
                      <button
                        onClick={() => {
                          const mainSection = document.getElementById('about-horizontal-container');
                          if (mainSection) {
                            mainSection.scrollTo({ left: 0, behavior: 'smooth' });
                          }
                        }}
                        className="hover:text-white transition-colors duration-300"
                      >
                        ← Back to About Us
                      </button>
                      <span>Scroll down to continue through sections</span>
                    </div>
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
                  <div className="absolute left-[1.5rem] bottom-[1.5rem] flex flex-col items-center space-y-3">
                    <span className="text-[clamp(72px,9vw,140px)] font-light text-[#F8F9FA] leading-none">D</span>
                    <span className="text-[clamp(72px,9vw,140px)] font-light text-[#F8F9FA] leading-none">S</span>
                    <span className="text-[clamp(72px,9vw,140px)] font-light text-[#F8F9FA] leading-none">L</span>
                  </div>

                  {/* Content Center */}
                  <div className="flex flex-col items-center justify-center text-center max-w-[900px] mx-auto">
                    <h2 className="text-[clamp(48px,8vw,120px)] font-light text-[#F8F9FA] mb-8">Our Approach</h2>
                    <p className="text-[clamp(18px,2.5vw,32px)] font-light text-white/90 leading-[1.5] mb-12">
                      We combine deep technical expertise with creative vision, fostering environments where breakthrough ideas can flourish.
                    </p>
                    <div className="text-white/50 text-sm">
                      <button
                        onClick={() => {
                          const mainSection = document.getElementById('about-horizontal-container');
                          if (mainSection) {
                            mainSection.scrollTo({ left: 0, behavior: 'smooth' });
                          }
                        }}
                        className="hover:text-white transition-colors duration-300"
                      >
                        ← Back to About Us
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Our Team Detail */}
              <div 
                id="about-team" 
                className="about-detail-section bg-white"
              >
                <div className="relative w-full h-full py-[4rem] px-[4vw] flex flex-col justify-center">
                  
                  {/* Content Center */}
                  <div className="flex flex-col items-center justify-center text-center max-w-[900px] mx-auto">
                    <h2 className="text-[clamp(48px,8vw,120px)] font-light text-[#4A90E2] mb-8">Our Team</h2>
                    <p className="text-[clamp(18px,2.5vw,32px)] font-light text-black/80 leading-[1.5] mb-12">
                      Authenticity, creativity, and community drive everything we do. We believe the best solutions emerge from diverse perspectives.
                    </p>
                    <div className="text-black/50 text-sm">
                      <button
                        onClick={() => {
                          const mainSection = document.getElementById('about-horizontal-container');
                          if (mainSection) {
                            mainSection.scrollTo({ left: 0, behavior: 'smooth' });
                          }
                        }}
                        className="hover:text-black transition-colors duration-300"
                      >
                        ← Back to About Us
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4: Our Values Detail - Final Section */}
              <div 
                id="about-values" 
                className="about-detail-section bg-[#1a1a1a]"
              >
                <div className="relative w-full h-full py-[4rem] px-[4vw] flex flex-col justify-center">
                  
                  {/* D/S/L Stacked Letters - Bottom Right */}
                  <div className="absolute right-[1.5rem] bottom-[1.5rem] flex flex-col items-center space-y-3">
                    <span className="text-[clamp(72px,9vw,140px)] font-light text-[#4A90E2] leading-none">D</span>
                    <span className="text-[clamp(72px,9vw,140px)] font-light text-[#4A90E2] leading-none">S</span>
                    <span className="text-[clamp(72px,9vw,140px)] font-light text-[#4A90E2] leading-none">L</span>
                  </div>

                  {/* Content Center */}
                  <div className="flex flex-col items-center justify-center text-center max-w-[900px] mx-auto">
                    <h2 className="text-[clamp(48px,8vw,120px)] font-light text-[#4A90E2] mb-8">Our Values</h2>
                    <p className="text-[clamp(18px,2.5vw,32px)] font-light text-white/90 leading-[1.5] mb-12">
                      Building sustainable companies that create meaningful change in the creator economy and beyond.
                    </p>
                    <div className="text-white/50 text-sm">
                      <button
                        onClick={() => {
                          const mainSection = document.getElementById('about-horizontal-container');
                          if (mainSection) {
                            mainSection.scrollTo({ left: 0, behavior: 'smooth' });
                          }
                        }}
                        className="hover:text-white transition-colors duration-300"
                      >
                        ← Back to About Us
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Section 3: Our Work with Horizontal Scroll */}
      <section id="companies" className="section-container">
        <div id="companies-horizontal-container" className="horizontal-scroll-container" style={{ direction: 'rtl' }}>
          
          {/* Main Our Work Section - First in RTL means rightmost/default position */}
          <div className="horizontal-section bg-[#4A90E2]" style={{ direction: 'ltr' }}>
            <div className="relative w-full h-full py-[4rem] px-[4vw] flex flex-col">
              
              {/* D/S/L Stacked Letters - Bottom Left */}
              <div className="absolute left-[1.5rem] bottom-[1.5rem] flex flex-col items-center space-y-3">
                <span className="text-[clamp(72px,9vw,140px)] font-light text-[#F8F9FA] leading-none">D</span>
                <span className="text-[clamp(72px,9vw,140px)] font-light text-[#F8F9FA] leading-none">S</span>
                <span className="text-[clamp(72px,9vw,140px)] font-light text-[#F8F9FA] leading-none">L</span>
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

          {/* Our Work Detail Sections - Contained Horizontal Scroll */}
          <div className="horizontal-section bg-[#4A90E2]">
            <div className="work-detail-container">
              
              {/* Section 1: Portfolio Companies Detail */}
              <div 
                id="companies-portfolio" 
                className="work-detail-section bg-[#1a1a1a]"
              >
                <div className="relative w-full h-full py-[4rem] px-[4vw] flex flex-col justify-center">
                  
                                     {/* D/S/L Stacked Letters - Bottom Left */}
                   <div className="absolute left-[1.5rem] bottom-[1.5rem] flex flex-col items-center space-y-3">
                     <span className="text-[clamp(72px,9vw,140px)] font-light text-[#4A90E2] leading-none">D</span>
                     <span className="text-[clamp(72px,9vw,140px)] font-light text-[#4A90E2] leading-none">S</span>
                     <span className="text-[clamp(72px,9vw,140px)] font-light text-[#4A90E2] leading-none">L</span>
                   </div>

                  {/* Content Center */}
                  <div className="flex flex-col items-center justify-center text-center max-w-[900px] mx-auto">
                    <h2 className="text-[clamp(48px,8vw,120px)] font-light text-[#4A90E2] mb-8">Portfolio Companies</h2>
                    <p className="text-[clamp(18px,2.5vw,32px)] font-light text-white/90 leading-[1.5] mb-12">
                      Building and investing in innovative startups that are reshaping industries and creating the future of technology.
                    </p>
                    <div className="text-white/50 text-sm flex space-x-8">
                      <button
                        onClick={() => {
                          const mainSection = document.getElementById('companies-horizontal-container');
                          if (mainSection) {
                            mainSection.scrollTo({ left: 0, behavior: 'smooth' });
                          }
                        }}
                        className="hover:text-white transition-colors duration-300"
                      >
                        ← Back to Our Work
                      </button>
                      <span>Scroll right to continue through sections</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Emerging Tech Detail */}
              <div 
                id="companies-emerging-tech" 
                className="work-detail-section bg-white"
              >
                <div className="relative w-full h-full py-[4rem] px-[4vw] flex flex-col justify-center">
                  
                  {/* Content Center */}
                  <div className="flex flex-col items-center justify-center text-center max-w-[900px] mx-auto">
                    <h2 className="text-[clamp(48px,8vw,120px)] font-light text-[#4A90E2] mb-8">Emerging Tech</h2>
                    <p className="text-[clamp(18px,2.5vw,32px)] font-light text-black/80 leading-[1.5] mb-12">
                      Exploring cutting-edge technologies like AI, blockchain, and quantum computing to unlock new possibilities.
                    </p>
                    <div className="text-black/50 text-sm">
                      <button
                        onClick={() => {
                          const mainSection = document.getElementById('companies-horizontal-container');
                          if (mainSection) {
                            mainSection.scrollTo({ left: 0, behavior: 'smooth' });
                          }
                        }}
                        className="hover:text-black transition-colors duration-300"
                      >
                        ← Back to Our Work
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Creator Tools Detail */}
              <div 
                id="companies-creator-tools" 
                className="work-detail-section bg-[#4A90E2]"
              >
                <div className="relative w-full h-full py-[4rem] px-[4vw] flex flex-col justify-center">
                  
                                     {/* D/S/L Stacked Letters - Bottom Right */}
                   <div className="absolute right-[1.5rem] bottom-[1.5rem] flex flex-col items-center space-y-3">
                     <span className="text-[clamp(72px,9vw,140px)] font-light text-[#F8F9FA] leading-none">D</span>
                     <span className="text-[clamp(72px,9vw,140px)] font-light text-[#F8F9FA] leading-none">S</span>
                     <span className="text-[clamp(72px,9vw,140px)] font-light text-[#F8F9FA] leading-none">L</span>
                   </div>

                  {/* Content Center */}
                  <div className="flex flex-col items-center justify-center text-center max-w-[900px] mx-auto">
                    <h2 className="text-[clamp(48px,8vw,120px)] font-light text-[#F8F9FA] mb-8">Creator Tools</h2>
                    <p className="text-[clamp(18px,2.5vw,32px)] font-light text-white/90 leading-[1.5] mb-12">
                      Developing platforms and tools that empower creators to build, monetize, and scale their creative endeavors.
                    </p>
                    <div className="text-white/50 text-sm">
                      <button
                        onClick={() => {
                          const mainSection = document.getElementById('companies-horizontal-container');
                          if (mainSection) {
                            mainSection.scrollTo({ left: 0, behavior: 'smooth' });
                          }
                        }}
                        className="hover:text-white transition-colors duration-300"
                      >
                        ← Back to Our Work
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4: Innovation Labs Detail - Final Section */}
              <div 
                id="companies-innovation-labs" 
                className="work-detail-section bg-[#1a1a1a]"
              >
                <div className="relative w-full h-full py-[4rem] px-[4vw] flex flex-col justify-center">
                  
                                     {/* D/S/L Stacked Letters - Top Left */}
                   <div className="absolute left-[1.5rem] top-[1.5rem] flex flex-col items-center space-y-3">
                     <span className="text-[clamp(72px,9vw,140px)] font-light text-[#4A90E2] leading-none">D</span>
                     <span className="text-[clamp(72px,9vw,140px)] font-light text-[#4A90E2] leading-none">S</span>
                     <span className="text-[clamp(72px,9vw,140px)] font-light text-[#4A90E2] leading-none">L</span>
                   </div>

                  {/* Content Center */}
                  <div className="flex flex-col items-center justify-center text-center max-w-[900px] mx-auto">
                    <h2 className="text-[clamp(48px,8vw,120px)] font-light text-[#4A90E2] mb-8">Innovation Labs</h2>
                    <p className="text-[clamp(18px,2.5vw,32px)] font-light text-white/90 leading-[1.5] mb-12">
                      Experimental projects and research initiatives that push the boundaries of what&apos;s possible in technology.
                    </p>
                    <div className="text-white/50 text-sm">
                      <button
                        onClick={() => {
                          const mainSection = document.getElementById('companies-horizontal-container');
                          if (mainSection) {
                            mainSection.scrollTo({ left: 0, behavior: 'smooth' });
                          }
                        }}
                        className="hover:text-white transition-colors duration-300"
                      >
                        ← Back to Our Work
                      </button>
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
          
          {/* D/S/L Stacked Letters - Bottom Right */}
          <div className="absolute right-[1.5rem] bottom-[1.5rem] flex flex-col items-center space-y-3">
            <div className="h-[clamp(72px,9vw,140px)] leading-none">
              <ProximityGradientText
                colors={["#3b82f6", "#ec4899", "#fbbf24", "#3b82f6"]}
                proximityRadius={300}
              >
                D
              </ProximityGradientText>
            </div>
            <div className="h-[clamp(72px,9vw,140px)] leading-none">
              <ProximityGradientText
                colors={["#3b82f6", "#ec4899", "#fbbf24", "#3b82f6"]}
                proximityRadius={300}
              >
                S
              </ProximityGradientText>
            </div>
            <div className="h-[clamp(72px,9vw,140px)] leading-none">
              <ProximityGradientText
                colors={["#3b82f6", "#ec4899", "#fbbf24", "#3b82f6"]}
                proximityRadius={300}
              >
                L
              </ProximityGradientText>
            </div>
          </div>

          {/* Main Content - Left Side (narrower to avoid image overlap) */}
          <div className="absolute left-[4vw] top-[12rem]">
            <div className="max-w-[35vw]">
              
              {/* Animated Headline */}
              <div className="mb-[3rem] h-[80px] relative">
                <ProximityGradientText
                  colors={["#3b82f6", "#ec4899", "#fbbf24", "#3b82f6"]}
                  proximityRadius={500}
                >
                  LET&apos;S CREATE
                </ProximityGradientText>
              </div>

              {/* Supporting Text */}
              <div className="space-y-[2rem] max-w-[320px]">
                <p className="text-[16px] font-light text-black/80 leading-[1.6]">
                  Ready to build something extraordinary? We partner with visionary founders 
                  and companies to create digital experiences that redefine what&apos;s possible.
                </p>
                
                <p className="text-[16px] font-light text-black/80 leading-[1.6]">
                  From startups to Fortune 500 enterprises, we bring together strategic 
                  thinking, cutting-edge technology, and exceptional design to transform 
                  ambitious ideas into reality.
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

          {/* Dynamic Image Mosaic */}
          <div className="absolute left-[46vw] top-0 bottom-0 w-[min(550px,50vw)] h-full">
            <ImageMosaic />
          </div>

        </div>
      </section>

            {/* Section 5: Footer/Directory */}
      <section className="section-container bg-black">
        <div className="relative w-full h-full py-[4rem] px-[4vw] flex flex-col">
          
          {/* D/S/L Animated Letters - Top Left */}
          <DSLAnimation />

          {/* Main Footer Content (moved right to avoid D/S/L overlap) */}
          <div className="absolute left-[18vw] right-[4vw] top-[16rem]">
            
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
