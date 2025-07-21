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
  colors = ["#3b82f6", "#ffffff", "#ec4899", "#fbbf24", "#3b82f6"], // Blue, white, pink, yellow
  baseSpeed = 3, // Much faster base speed
  proximityRadius = 400, // Larger detection radius
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [trailingPos, setTrailingPos] = useState({ x: 0, y: 0 });
  const [isInProximity, setIsInProximity] = useState(false);
  const [proximityFactor, setProximityFactor] = useState(0);
  const [randomSpeedMultiplier, setRandomSpeedMultiplier] = useState(1);
  const [hoverTime, setHoverTime] = useState(0);
  const [isVeryClose, setIsVeryClose] = useState(false);

  React.useEffect(() => {
    let hoverTimer: NodeJS.Timeout;
    
    if (isVeryClose) {
      hoverTimer = setInterval(() => {
        setHoverTime(prev => Math.min(prev + 0.1, 5)); // Max 5 seconds
      }, 100);
    } else {
      setHoverTime(0);
    }

    return () => {
      if (hoverTimer) clearInterval(hoverTimer);
    };
  }, [isVeryClose]);

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      
      // Trailing effect - smoothly follow cursor
      setTrailingPos(prev => ({
        x: prev.x + (e.clientX - prev.x) * 0.15,
        y: prev.y + (e.clientY - prev.y) * 0.15,
      }));
      
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const distance = Math.sqrt(
          Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
        );
        
        const isClose = distance < proximityRadius;
        const veryClose = distance < 100; // Very close for swirl effect
        
        setIsInProximity(isClose);
        setIsVeryClose(veryClose);
        
        if (isClose) {
          // Calculate proximity factor (0 = far, 1 = very close)
          const factor = Math.max(0, 1 - (distance / proximityRadius));
          setProximityFactor(factor);
          
          // Add randomness that changes based on proximity
          const randomness = 0.3 + Math.random() * 1.8; // Faster variations
          const proximityBoost = 1 + factor * 3; // Even more speed boost
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
  
  // Much larger mask radius
  const maskRadius = Math.max(150, proximityRadius * proximityFactor * 1.2);
  const trailingRadius = Math.max(100, maskRadius * 0.6);
  
  // Dynamic swirl intensity based on hover time
  const swirlIntensity = Math.min(hoverTime * 20, 100); // Gradual increase
  
  const gradientStyle = {
    backgroundImage: `linear-gradient(45deg, ${colors.join(", ")})`,
    backgroundSize: "400% 400%", // Larger for more dynamic movement
  };

  const swirlGradientStyle = {
    backgroundImage: `conic-gradient(from ${swirlIntensity}deg, ${colors.join(", ")})`,
    backgroundSize: "300% 300%",
  };

  return (
    <div ref={containerRef} className={cn("relative w-full h-full", className)}>
      {/* Base black text - always visible */}
      <h2 className="text-[clamp(32px,5vw,80px)] font-light leading-[1.0] tracking-tighter text-left text-black relative z-10">
        {children}
      </h2>
      
      {/* Primary gradient text with main cursor mask */}
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
          duration: 0.2,
          ease: "easeOut"
        }}
      >
        <motion.h2
          className="text-[clamp(32px,5vw,80px)] font-light leading-[1.0] tracking-tighter text-left text-transparent"
          style={{
            ...(isVeryClose ? swirlGradientStyle : gradientStyle),
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
          }}
          animate={isVeryClose ? {
            // Swirl animation when very close
            backgroundPosition: [
              "0% 0%", 
              "100% 100%", 
              "0% 200%",
              "100% 0%",
              "0% 0%"
            ],
            rotate: [0, swirlIntensity * 0.1, 0],
          } : {
            // Regular linear movement
            backgroundPosition: [
              "0% 50%", 
              "100% 50%", 
              "0% 50%"
            ],
          }}
          transition={{
            duration: currentSpeed,
            repeat: Infinity,
            ease: isVeryClose ? "easeInOut" : "linear",
          }}
        >
          {children}
        </motion.h2>
      </motion.div>

      {/* Trailing gradient effect */}
      <motion.div
        className="absolute inset-0 z-19 pointer-events-none"
        style={{
          WebkitMask: containerRef.current 
            ? `radial-gradient(circle ${trailingRadius}px at ${trailingPos.x - containerRef.current.getBoundingClientRect().left}px ${trailingPos.y - containerRef.current.getBoundingClientRect().top}px, black 0%, black 40%, transparent 100%)`
            : 'none',
          mask: containerRef.current 
            ? `radial-gradient(circle ${trailingRadius}px at ${trailingPos.x - containerRef.current.getBoundingClientRect().left}px ${trailingPos.y - containerRef.current.getBoundingClientRect().top}px, black 0%, black 40%, transparent 100%)`
            : 'none',
        }}
        animate={{
          opacity: isInProximity ? 0.4 : 0,
        }}
        transition={{
          duration: 0.4,
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
              "50% 0%", 
              "150% 100%", 
              "50% 0%"
            ],
          }}
          transition={{
            duration: currentSpeed * 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {children}
        </motion.h2>
      </motion.div>
      
      {/* Enhanced shimmer effect */}
      <motion.div
        className="absolute inset-0 z-21 pointer-events-none"
        style={{
          WebkitMask: containerRef.current 
            ? `radial-gradient(circle ${maskRadius}px at ${cursorPos.x - containerRef.current.getBoundingClientRect().left}px ${cursorPos.y - containerRef.current.getBoundingClientRect().top}px, black 0%, black 60%, transparent 100%)`
            : 'none',
          mask: containerRef.current 
            ? `radial-gradient(circle ${maskRadius}px at ${cursorPos.x - containerRef.current.getBoundingClientRect().left}px ${cursorPos.y - containerRef.current.getBoundingClientRect().top}px, black 0%, black 60%, transparent 100%)`
            : 'none',
          background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,${0.3 + proximityFactor * 0.4 + hoverTime * 0.1}) 50%, transparent 100%)`,
          transform: "translateX(-100%)",
        }}
        animate={isInProximity ? {
          transform: ["translateX(-100%)", "translateX(100%)"],
        } : {}}
        transition={{
          duration: currentSpeed * 0.4, // Faster shimmer
          repeat: isInProximity ? Infinity : 0,
          repeatDelay: currentSpeed * 0.2,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

interface ImageMosaicProps {
  className?: string;
}

const DESIGN_IMAGES = [
  // Left column images (8 total, 3 portrait)
  {
    src: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&auto=format&fit=crop&q=80",
    alt: "Modern architecture",
    aspectRatio: "aspect-[4/3]", // landscape
  },
  {
    src: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80",
    alt: "Interior design",
    aspectRatio: "aspect-[3/4]", // portrait
  },
  {
    src: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&auto=format&fit=crop&q=80",
    alt: "Minimalist design",
    aspectRatio: "aspect-[16/9]", // landscape
  },
  {
    src: "https://images.unsplash.com/photo-1586473219010-2ffc57b0d282?w=600&auto=format&fit=crop&q=80",
    alt: "Product design",
    aspectRatio: "aspect-[3/4]", // portrait
  },
  {
    src: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&auto=format&fit=crop&q=80",
    alt: "Graphic design",
    aspectRatio: "aspect-[4/3]", // landscape
  },
  {
    src: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600&auto=format&fit=crop&q=80",
    alt: "UI design",
    aspectRatio: "aspect-[3/4]", // portrait
  },
  {
    src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80",
    alt: "Brand design",
    aspectRatio: "aspect-[5/3]", // landscape
  },
  {
    src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=80",
    alt: "Web design",
    aspectRatio: "aspect-[4/3]", // landscape
  },
];

const RIGHT_COLUMN_IMAGES = [
  // Right column images (8 total, 2 portrait)
  {
    src: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&auto=format&fit=crop&q=80",
    alt: "Creative workspace",
    aspectRatio: "aspect-[16/9]", // landscape
  },
  {
    src: "https://images.unsplash.com/photo-1542744173-b6894b6b5d8d?w=600&auto=format&fit=crop&q=80",
    alt: "Design tools",
    aspectRatio: "aspect-[3/4]", // portrait
  },
  {
    src: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&auto=format&fit=crop&q=80",
    alt: "Typography",
    aspectRatio: "aspect-[4/3]", // landscape
  },
  {
    src: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600&auto=format&fit=crop&q=80",
    alt: "Color palette",
    aspectRatio: "aspect-[3/4]", // portrait
  },
  {
    src: "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800&auto=format&fit=crop&q=80",
    alt: "Digital art",
    aspectRatio: "aspect-[5/3]", // landscape
  },
  {
    src: "https://images.unsplash.com/photo-1542744173-05336fcc7ad4?w=800&auto=format&fit=crop&q=80",
    alt: "Design process",
    aspectRatio: "aspect-[4/3]", // landscape
  },
  {
    src: "https://images.unsplash.com/photo-1542744173-b6894b6b5d8d?w=800&auto=format&fit=crop&q=80",
    alt: "Creative concept",
    aspectRatio: "aspect-[16/9]", // landscape
  },
  {
    src: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&auto=format&fit=crop&q=80",
    alt: "Design inspiration",
    aspectRatio: "aspect-[4/3]", // landscape
  },
];

const ImageMosaic: React.FC<ImageMosaicProps> = ({ className }) => {
  const leftColumnRef = React.useRef<HTMLDivElement>(null);
  const rightColumnRef = React.useRef<HTMLDivElement>(null);
  const leftScrollY = React.useRef(0);
  const rightScrollY = React.useRef(0);

  React.useEffect(() => {
    const animate = () => {
      // Smooth infinite scrolling
      leftScrollY.current += 0.5; // scroll down
      rightScrollY.current -= 0.5; // scroll up

      if (leftColumnRef.current) {
        const leftHeight = leftColumnRef.current.scrollHeight / 2;
        if (leftScrollY.current >= leftHeight) {
          leftScrollY.current = 0;
        }
        leftColumnRef.current.style.transform = `translateY(-${leftScrollY.current}px)`;
      }

      if (rightColumnRef.current) {
        const rightHeight = rightColumnRef.current.scrollHeight / 2;
        if (Math.abs(rightScrollY.current) >= rightHeight) {
          rightScrollY.current = 0;
        }
        rightColumnRef.current.style.transform = `translateY(${rightScrollY.current}px)`;
      }

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return (
    <div className={cn("w-full h-full overflow-hidden bg-transparent", className)}>
      <div className="flex h-full gap-3">
        {/* Left Column - Scrolling Down */}
        <div className="w-1/2 overflow-hidden">
          <motion.div
            ref={leftColumnRef}
            className="flex flex-col gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {/* Duplicate images for infinite scroll */}
            {[...DESIGN_IMAGES, ...DESIGN_IMAGES].map((image, index) => (
              <motion.div
                key={`left-${index}`}
                className={cn(
                  "relative overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300",
                  image.aspectRatio,
                  "w-full"
                )}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Right Column - Scrolling Up */}
        <div className="w-1/2 overflow-hidden">
          <motion.div
            ref={rightColumnRef}
            className="flex flex-col gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            {/* Duplicate images for infinite scroll */}
            {[...RIGHT_COLUMN_IMAGES, ...RIGHT_COLUMN_IMAGES].map((image, index) => (
              <motion.div
                key={`right-${index}`}
                className={cn(
                  "relative overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300",
                  image.aspectRatio,
                  "w-full"
                )}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={image.src}
                  alt={image.alt}
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
                  colors={["#3b82f6", "#ffffff", "#ec4899", "#fbbf24", "#3b82f6"]}
                  baseSpeed={2}
                  proximityRadius={500}
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

          {/* Dynamic Image Mosaic */}
          <div className="absolute left-[42vw] top-[8rem] w-[450px] h-[400px]">
            <ImageMosaic />
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
