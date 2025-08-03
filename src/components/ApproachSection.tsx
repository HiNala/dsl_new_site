"use client";

import React from 'react';
import { motion } from 'framer-motion';

const ApproachSection: React.FC = () => {
  const approaches = [
    {
      title: "Creative Vision",
      description: "Fostering environments where innovative ideas flourish and conventional thinking is challenged",
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop&crop=center",
      icon: "🎨",
      gradient: "from-purple-500/20 to-pink-500/20"
    },
    {
      title: "Technical Excellence", 
      description: "Deep expertise in modern technologies with scalable, production-grade solutions",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop&crop=center",
      icon: "⚡",
      gradient: "from-blue-500/20 to-cyan-500/20"
    },
    {
      title: "Creator Economy",
      description: "Building platforms and tools that empower creators and celebrate human authenticity", 
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop&crop=center",
      icon: "🚀",
      gradient: "from-green-500/20 to-emerald-500/20"
    },
    {
      title: "Innovation Labs",
      description: "Experimental spaces where breakthrough technologies and bold ideas come to life",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&crop=center",
      icon: "🔬",
      gradient: "from-orange-500/20 to-red-500/20"
    }
  ];

  return (
    <div className="relative w-full h-full py-[4rem] px-[4vw] overflow-hidden">
      {/* Modern gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#4A90E2] via-[#5B9BD5] to-[#3A7BD5]"></div>
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }}></div>

      {/* Down Navigation - Bottom Center */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <button
          onClick={() => {
            const container = document.querySelector('.about-detail-container');
            if (container) {
              container.scrollTo({ top: 4 * window.innerHeight, behavior: 'smooth' });
            }
          }}
          className="flex items-center justify-center text-white hover:text-blue-200 transition-all duration-300 p-2 rounded-full hover:bg-white/10"
        >
          <svg width="32" height="32" viewBox="0 0 16 16" fill="currentColor">
            <path d="M3 6L8 11L13 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Header Section */}
      <div className="relative z-30 text-center mb-[4rem]">
        <motion.h2
          className="text-[clamp(48px,6vw,90px)] font-light text-white mb-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Our Approach
        </motion.h2>
        <motion.p
          className="text-[clamp(18px,2vw,26px)] font-light text-white/90 max-w-[700px] mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          Combining Deep Technical Expertise with Creative Vision
        </motion.p>
      </div>

      {/* Modern 4-Card Offset Grid */}
      <div className="relative z-20 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {approaches.map((approach, index) => (
            <motion.div
              key={approach.title}
              className={`relative group ${
                index % 2 === 0 ? 'md:mt-0' : 'md:mt-24'
              }`}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.15,
                ease: "easeOut"
              }}
              viewport={{ once: true }}
            >
              {/* Modern Glass Card */}
              <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] hover:bg-white/15">
                
                {/* Image Section */}
                <div className="relative h-[180px] overflow-hidden">
                  <img
                    src={approach.image}
                    alt={approach.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Icon overlay */}
                  <div className="absolute top-6 right-6 w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl">
                    {approach.icon}
                  </div>
                  
                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${approach.gradient} to-transparent`}></div>
                </div>

                {/* Content Section */}
                <div className="p-8 space-y-4">
                  <motion.h3
                    className="text-[28px] font-semibold text-white leading-tight"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
                    viewport={{ once: true }}
                  >
                    {approach.title}
                  </motion.h3>
                  
                  <motion.p
                    className="text-[16px] font-light text-white/85 leading-[1.7] min-h-[80px]"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 + 0.5 }}
                    viewport={{ once: true }}
                  >
                    {approach.description}
                  </motion.p>

                  {/* Modern accent line */}
                  <div className="pt-4">
                    <div className="w-full h-[2px] bg-gradient-to-r from-white/0 via-white/60 to-white/0 group-hover:via-white/90 transition-all duration-500"></div>
                  </div>
                </div>

                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApproachSection;