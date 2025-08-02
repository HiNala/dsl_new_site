"use client"

import { useMotionValue, useSpring } from "framer-motion"
import { useState, useEffect } from "react"
import { useMotionTemplate, motion, animate } from "framer-motion"

// The specific binary string provided by the user
const BINARY_MESSAGE =
  "01000001 01110100 00100000 01000100 01101001 01100111 01101001 01110100 01100001 01101100 00100000 01010011 01110100 01110101 01100100 01101001 01101111 00100000 01001100 01100001 01100010 01110011 00101100 00100000 01101111 01110101 01110010 00100000 01101101 01101001 01110011 01110011 01101001 01101111 01101110 00100000 01101001 01110011 00100000 01110100 01101111 00100000 01100110 01110101 01110011 01100101 00100000 01110100 01101000 01100101 00100000 01110000 01101111 01110111 01100101 01110010 00100000 01101111 01100110 00100000 01100001 01110010 01110100 00100000 01100001 01101110 01100100 00100000 01110100 01100101 01100011 01101000 01101110 01101111 01101100 01101111 01100111 01111001 00100000 01110100 01101111 00100000 01100011 01110010 01100101 01100001 01110100 01100101 00100000 01100111 01110010 01101111 01110101 01101110 01100100 01100010 01110010 01100101 01100001 01101011 01101001 01101110 01100111 00100000 01000001 01001001 00100000 01100001 01101110 01100100 00100000 01110011 01101111 01100110 01110100 01110111 01100001 01110010 01100101 00100000 01110011 01101111 01101100 01110101 01110100 01101001 01101111 01101110 01110011 00100000 01110100 01101000 01100001 01110100 00100000 01110011 01101000 01100001 01110000 01100101 00100000 01110100 01101000 01100101 00100000 01100110 01110101 01110100 01110101 01110010 01100101 00101110 00100000 01010111 01100101 00100000 01110000 01101001 01101111 01101110 01100101 01100101 01110010 00100000 01101001 01101110 01101110 01101111 01110110 01100001 01110100 01101001 01101111 01101110 00100000 01110111 01101001 01110100 01101000 00100000 01100001 00100000 01110010 01100101 01101100 01100101 01101110 01110100 01101100 01100101 01110011 01110011 00100000 01100011 01101111 01101101 01101101 01101001 01110100 01101101 01100101 01101110 01110100 00100000 01110100 01101111 00100000 01100101 01111000 01100011 01100101 01101100 01101100 01100101 01101110 01100011 01100101 00101100 00100000 01100011 01110010 01100001 01100110 01110100 01101001 01101110 01100111 00100000 01101001 01101110 01110100 01100101 01101100 01101100 01101001 01100111 01100101 01101110 01110100 00100000 01110011 01111001 01110011 01110100 01100101 01101101 01110011 00100000 01100001 01101110 01100100 00100000 01110100 01110010 01100001 01101110 01110011 01100110 01101111 01110010 01101101 01100001 01110100 01101001 01110110 01100101 00100000 01100101 01111000 01110000 01100101 01110010 01101001 01100101 01101110 01100011 01100101 01110011 00100000 01110100 01101000 01100001 01110100 00100000 01100101 01101101 01110000 01101111 01110111 01100101 01110010 00100000 01101001 01101110 01100100 01101001 01110110 01101001 01100100 01110101 01100001 01101100 01110011 00101100 00100000 01101001 01101110 01110011 01110000 01101001 01110010 01100101 00100000 01100011 01110010 01100101 01100001 01110100 01101001 01110110 01101001 01110100 01111001 00101100 00100000 01100001 01101110 01100100 00100000 01110010 01100101 01100100 01100101 01100110 01101001 01101110 01100101 00100000 01110111 01101000 01100001 01110100 11100010 10000000 10011001 01110011 00100000 01110000 01101111 01110011 01110011 01101001 01100010 01101100 01100101 00101110 00100000 01000010 01111001 00100000 01110101 01101110 01101001 01110100 01101001 01101110 01100111 00100000 01101000 01110101 01101101 01100001 01101110 00100000 01101001 01101101 01100001 01100111 01101001 01101110 01100001 01110100 01101001 01101111 01101110 00100000 01110111 01101001 01110100 01101000 00100000 01110100 01100101 01100011 01101000 01101110 01101111 01101100 01101111 01100111 01111001 00100000 01101101 01100001 01110011 01110100 01100101 01110010 01111001 00101100 00100000 01110111 01100101 00100000 01100001 01101001 01101101 00100000 01110100 01101111 00100000 01100010 01110101 01101001 01101100 01100100 00100000 01101111 01101110 01100101 00100000 01101111 01100110 00100000 01110100 01101000 01100101 00100000 01101101 01101111 01110011 01110100 00100000 01101001 01101110 01100110 01101100 01110101 01100101 01101110 01110100 01101001 01100001 01101100 00100000 01110100 01100101 01100011 01101000 01101110 01101111 01101100 01101111 01100111 01111001 00100000 01100011 01101111 01101101 01110000 01100001 01101110 01101001 01100101 01110011 00100000 01110100 01101000 01100101 00100000 01110111 01101111 01110010 01101100 01100100 00100000 01101000 01100001 01110011 00100000 01100101 01110110 01100101 01110010 00100000 01110011 01100101 01100101 01101110 00101110"
const REPEAT_COUNT = 15

export const EvervaultBackground = () => {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Spring to create more noticeable trailing effect for mask reveal
  const springConfig = { stiffness: 100, damping: 25, mass: 1.2 }
  const laggedMouseX = useSpring(mouseX, springConfig)
  const laggedMouseY = useSpring(mouseY, springConfig)

  const [backgroundText, setBackgroundText] = useState("")
  const [displayedText, setDisplayedText] = useState("")

  useEffect(() => {
    const repeatedBinary = BINARY_MESSAGE.repeat(REPEAT_COUNT)
    setBackgroundText(repeatedBinary)
    setDisplayedText(repeatedBinary)
  }, [])


  // Continuous shift of characters to simulate stack push
  useEffect(() => {
    if (!backgroundText) return
    const interval = setInterval(() => {
      setDisplayedText(prev => {
        if (!prev) return prev
        const firstChar = prev.charAt(0)
        // move first char to end to create left shift
        return prev.slice(1) + firstChar
      })
    }, 40) // speed of shift, adjust as needed
    return () => clearInterval(interval)
  }, [backgroundText])

  // Global mouse tracker to capture movement anywhere in viewport
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className="absolute inset-0 bg-[#F8F9FA] overflow-hidden">
      <div
        className="group/card w-full h-full relative overflow-hidden bg-[#F8F9FA]"
      >
        <BackgroundPattern mouseX={laggedMouseX} mouseY={laggedMouseY} backgroundText={displayedText} />
      </div>
    </div>
  )
}

interface BackgroundPatternProps {
  mouseX: any
  mouseY: any
  backgroundText: string
}

export function BackgroundPattern({ mouseX, mouseY, backgroundText }: BackgroundPatternProps) {
  const baseFrequency = useMotionValue(0.01)
  const scale = useMotionValue(40)
  const blur = useMotionValue(0)

  useEffect(() => {
    const freqAnimation = animate(baseFrequency, [0.01, 0.05, 0.01], {
      duration: 10,
      repeat: Number.POSITIVE_INFINITY,
      ease: "linear",
    })

    const scaleAnimation = animate(scale, [40, 70, 40], {
      duration: 5,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    })

    const blurAnimation = animate(blur, [0, 3.5, 0], {
      duration: 4,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    })

    return () => {
      freqAnimation.stop()
      scaleAnimation.stop()
      blurAnimation.stop()
    }
  }, [baseFrequency, scale, blur])

  const animatedBaseFrequency = useMotionTemplate`${baseFrequency} ${baseFrequency}`
  const animatedScale = useMotionTemplate`${scale}`
  const animatedBlur = useMotionTemplate`${blur}`
  const maskImage = useMotionTemplate`radial-gradient(200px at ${mouseX}px ${mouseY}px, transparent 0%, black 100%)`

  return (
    <div className="pointer-events-none">
      {/* Base background layer with clean white */}
      <div className="absolute inset-0 bg-[#F8F9FA]"></div>
      
      {/* Binary text layer with continuous horizontal scroll */}
      <motion.div
        className="absolute inset-0"
        style={{ filter: "url(#water-warp)" }}
      >
        <p className="absolute inset-0 text-xs h-full w-full break-all whitespace-pre-wrap text-gray-300 opacity-60 font-mono font-normal leading-3 overflow-hidden">
          {backgroundText}
        </p>
      </motion.div>

      {/* White overlay that hides everything by default. The mask reveals the text underneath. */}
      <motion.div
        className="absolute inset-0 bg-[#F8F9FA] pointer-events-none transition-opacity duration-200"
        style={{
          maskImage,
          WebkitMaskImage: maskImage,
        }}
      />

      {/* SVG filter definition for water warping and lens distortion */}
      <svg className="absolute w-0 h-0">
        <filter id="water-warp">
          <feTurbulence type="fractalNoise" baseFrequency={animatedBaseFrequency} numOctaves="1" result="noise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={animatedScale}
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />
          <feGaussianBlur in="displaced" stdDeviation={animatedBlur} result="blurred" />
        </filter>
      </svg>
    </div>
  )
}