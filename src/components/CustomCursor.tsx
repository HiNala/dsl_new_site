"use client"

import { useEffect } from "react"
import { motion, useMotionValue } from "framer-motion"

export default function CustomCursor() {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)

  useEffect(() => {
    const move = (e: MouseEvent) => {
      // immediate update with no lag for maximum responsiveness
      x.set(e.clientX - 16)
      y.set(e.clientY - 16)
    }
    window.addEventListener("mousemove", move, { passive: true })
    return () => window.removeEventListener("mousemove", move)
  }, [x, y])

  return (
    <motion.div
      className="fixed left-0 top-0 pointer-events-none z-[9999] w-8 h-8 rounded-full border-4 border-white mix-blend-difference"
      style={{ x, y }}
    />
  )
}
