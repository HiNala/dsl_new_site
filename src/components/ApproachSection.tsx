"use client";

import React from 'react';
import { motion } from 'framer-motion';

const ApproachSection: React.FC = () => {
  const approaches = [
    {
      title: "Creative Vision",
      description: "Fostering environments where innovative ideas flourish and conventional thinking is challenged",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop&crop=center",
      side: "left",
      offset: "top-[180px]"
    },
    {
      title: "Technical Excellence", 
      description: "Deep expertise in modern technologies with scalable, production-grade solutions",
      image: "https://images.unsplash.com/photo-1551808525-51a94da548ce?w=800&h=600&fit=crop&crop=center",
      side: "right",
      offset: "top-[120px]"
    },
    {
      title: "Creator Economy",
      description: "Building platforms and tools that empower creators and celebrate human authenticity",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop&crop=center",
      side: "left",
      offset: "top-[480px]"
    },
    {
      title: "Scale & Impact",
      description: "Designing for growth with sustainable architecture that creates lasting value",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&crop=center",
      side: "right",
      offset: "top-[420px]"
    }
  ];

  return (
    <div className="relative w-full h-full py-[4rem] px-[4vw] flex flex-col">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#4A90E2] via-[#4A90E2] to-[#3A7BD5]"></div>

      {/* Down Navigation - Bottom Center */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <button
          onClick={() => {
            const container = document.querySelector('.about-detail-container');
            if (container) {
              container.scrollTo({ top: 4 * window.innerHeight, behavior: 'smooth' });
            }
          }}
          className="flex items-center justify-center text-white hover:text-blue-200 transition-all duration-300"
        >
          <svg width="32" height="32" viewBox="0 0 16 16" fill="currentColor">
            <path d="M3 6L8 11L13 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Header Section - Dedicated Top Space */}
      <div className="relative z-30 text-center mb-[3rem]">
        <motion.h2
          className="text-[clamp(38px,5vw,80px)] font-light text-white"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Our Approach
        </motion.h2>
        <motion.p
          className="text-[clamp(16px,1.8vw,24px)] font-light text-white/80 mt-4 max-w-[600px] mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          Combining Deep Technical Expertise with Creative Vision
        </motion.p>
      </div>

      {/* Clean Grid Layout - No Overlaps */}
      <div className="relative z-20 flex-1 grid grid-cols-1 gap-[2rem] max-w-[900px] mx-auto">
        {approaches.map((approach, index) => (
          <motion.div
            key={approach.title}
            className="relative w-full h-[280px] group"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8, 
              delay: index * 0.1 + 0.3,
              ease: "easeOut"
            }}
            viewport={{ once: true }}
          >
            {/* Clean Card Design */}
            <div className="relative w-full h-full overflow-hidden rounded-2xl shadow-2xl">
              <img
                src={approach.image}
                alt={approach.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Gradient overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30"></div>
              
              {/* Content overlay */}
              <div className="absolute inset-0 p-8 flex flex-col justify-center">
                <motion.h3
                  className="text-[24px] font-semibold text-white mb-3 leading-tight"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 + 0.5 }}
                  viewport={{ once: true }}
                >
                  {approach.title}
                </motion.h3>
                <motion.p
                  className="text-[16px] font-light text-white/90 leading-[1.6] max-w-[500px]"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 + 0.7 }}
                  viewport={{ once: true }}
                >
                  {approach.description}
                </motion.p>
              </div>

              {/* Clean accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-white/0 via-white/60 to-white/0 group-hover:via-white/80 transition-all duration-500"></div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ApproachSection; 