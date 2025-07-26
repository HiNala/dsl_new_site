"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Code2, Rocket, Sparkles, Building } from 'lucide-react';

const MissionSection: React.FC = () => {
  return (
    <div className="relative w-full h-full py-[4rem] px-[4vw] flex flex-col justify-center">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-[#4A90E2]/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#4A90E2]/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Content - Hero-inspired Layout */}
      <div className="relative z-10 w-full h-full flex items-center">
        
        {/* Main Mission Statement - Left Side (like hero headline) */}
        <div className="absolute left-[4vw] top-[15vh] max-w-[55vw]">
          <motion.h2
            className="text-[clamp(48px,8vw,120px)] font-light text-[#4A90E2] mb-8 leading-[1.1]"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Our Mission
          </motion.h2>
          
          <motion.h3
            className="text-[clamp(24px,4vw,42px)] font-medium text-white leading-[1.3] mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Building Beautiful, Functional Software That Shapes Tomorrow
          </motion.h3>
        </div>

        {/* Mission Details - Right Side (like hero body text) */}
        <div className="absolute right-[4vw] top-[25vh] w-[min(450px,38vw)]">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-[15px] font-normal leading-[1.65] text-white/90 opacity-90">
              We partner with visionary creators and innovators to build exceptional 
              software products that push boundaries. Our mission is to transform 
              bold ideas into beautiful, scalable solutions that empower people and 
              help build the future we want to see.
            </p>

            {/* Core Principles - Clean List Format */}
            <div className="space-y-4">
              <h4 className="text-[16px] font-medium text-[#4A90E2] mb-4">Our Core Principles</h4>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <span className="w-1.5 h-1.5 bg-[#4A90E2] rounded-full mt-2 flex-shrink-0"></span>
                  <div>
                    <span className="text-[14px] font-medium text-white">Beautiful Code</span>
                    <p className="text-[13px] text-white/80 leading-[1.5]">Crafted with precision, built to last</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <span className="w-1.5 h-1.5 bg-[#4A90E2] rounded-full mt-2 flex-shrink-0"></span>
                  <div>
                    <span className="text-[14px] font-medium text-white">Future-Ready</span>
                    <p className="text-[13px] text-white/80 leading-[1.5]">Scalable solutions for tomorrow's challenges</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <span className="w-1.5 h-1.5 bg-[#4A90E2] rounded-full mt-2 flex-shrink-0"></span>
                  <div>
                    <span className="text-[14px] font-medium text-white">Human-Centered</span>
                    <p className="text-[13px] text-white/80 leading-[1.5]">Technology that celebrates creativity</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <span className="w-1.5 h-1.5 bg-[#4A90E2] rounded-full mt-2 flex-shrink-0"></span>
                  <div>
                    <span className="text-[14px] font-medium text-white">World Impact</span>
                    <p className="text-[13px] text-white/80 leading-[1.5]">Products the world can enjoy and benefit from</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Vision Statement */}
            <div className="pt-4 border-t border-white/20">
              <p className="text-[13px] text-white/70 leading-[1.5] italic">
                "Technology that serves humanity's highest aspirations and celebrates human creativity."
              </p>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default MissionSection; 