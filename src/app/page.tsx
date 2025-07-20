'use client'

import Spline from '@splinetool/react-spline/next';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="h-screen w-full relative">
      <Spline
        scene="https://prod.spline.design/RSlYov6mvjeyk1b6/scene.splinecode" 
      />
      
      {/* Title - Left Side */}
      <div className="absolute top-1/4 left-8 md:left-16 -translate-y-1/2 z-10">
        <h1 className="text-black font-light text-4xl md:text-6xl lg:text-7xl leading-none tracking-tight">
          <div>Digital</div>
          <div>Studio</div>
          <div>Labs</div>
        </h1>
        
        {/* Our Work Button */}
        <motion.button
          className="mt-8 px-8 py-4 bg-black/10 backdrop-blur-xl border border-black/30 rounded-2xl text-black font-medium transition-all duration-300 hover:bg-black/20 hover:border-black/40 shadow-lg"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          Our Work
        </motion.button>
      </div>
      
      {/* Tagline - Bottom */}
      <div className="absolute bottom-8 left-8 md:left-16 right-8 md:right-16 z-10">
        <blockquote className="text-black/70 text-sm md:text-base leading-relaxed max-w-2xl">
          "The minute you choose to do what you really want to do, it's a different kind of life."
          <footer className="text-black/50 text-xs md:text-sm mt-2">
            - Buckminster Fuller
          </footer>
        </blockquote>
      </div>
    </main>
  );
}
