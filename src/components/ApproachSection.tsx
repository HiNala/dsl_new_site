"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Target, Code2, Zap, Users, Lightbulb, Rocket } from 'lucide-react';

const ApproachSection: React.FC = () => {
  const approaches = [
    {
      icon: Target,
      title: "Zero-to-One Focus",
      description: "Transforming bold ideas into breakthrough products from concept to market reality",
    },
    {
      icon: Code2,
      title: "Technical Excellence", 
      description: "Deep expertise in modern technologies with scalable, production-grade solutions",
    },
    {
      icon: Lightbulb,
      title: "Creative Vision",
      description: "Fostering environments where innovative ideas flourish and conventional thinking is challenged",
    },
    {
      icon: Users,
      title: "Creator Economy",
      description: "Building platforms and tools that empower creators and celebrate human authenticity",
    },
    {
      icon: Zap,
      title: "Rapid Iteration",
      description: "Agile development with continuous feedback loops and data-driven optimization",
    },
    {
      icon: Rocket,
      title: "Scale & Impact",
      description: "Designing for growth with sustainable architecture that creates lasting value",
    },
  ];

  return (
    <div className="relative w-full h-full flex flex-col justify-center overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"
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
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"
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
      <div className="relative z-10 w-full h-full flex items-center px-[4vw]">
        
        {/* Main Approach Statement - Left Side */}
        <div className="flex-1 max-w-[50vw] pr-[3vw]">
          <motion.h2
            className="text-[clamp(48px,7vw,100px)] font-light text-[#F8F9FA] mb-6 leading-[1.1]"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Our Approach
          </motion.h2>
          
          <motion.h3
            className="text-[clamp(22px,3.5vw,36px)] font-medium text-white leading-[1.3] mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Combining Deep Technical Expertise with Creative Vision
          </motion.h3>
          
          <motion.div
            className="w-20 h-1 bg-white/30 mb-6"
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: 80 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          />
          
          <motion.p
            className="text-[16px] font-light text-white/90 leading-[1.6] max-w-[90%]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
          >
            We foster environments where breakthrough ideas flourish. Our proven 
            methodology blends strategic thinking, cutting-edge technology, and 
            human-centered design to build software products that redefine 
            possibilities and drive real impact.
          </motion.p>
        </div>

        {/* Approach Details - Right Side */}
        <div className="flex-1 max-w-[42vw]">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            {/* Core Methodologies - Clean List Format */}
            <div className="space-y-5">
              <h4 className="text-[18px] font-medium text-white mb-6">Our Core Methodologies</h4>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <span className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></span>
                  <div>
                    <span className="text-[15px] font-semibold text-white block mb-1">Zero-to-One Focus</span>
                    <p className="text-[14px] text-white/85 leading-[1.6]">Transforming bold ideas into breakthrough products from concept to market reality</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <span className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></span>
                  <div>
                    <span className="text-[15px] font-semibold text-white block mb-1">Technical Excellence</span>
                    <p className="text-[14px] text-white/85 leading-[1.6]">Deep expertise in modern technologies with scalable, production-grade solutions</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <span className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></span>
                  <div>
                    <span className="text-[15px] font-semibold text-white block mb-1">Creative Vision</span>
                    <p className="text-[14px] text-white/85 leading-[1.6]">Fostering environments where innovative ideas flourish and conventional thinking is challenged</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <span className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></span>
                  <div>
                    <span className="text-[15px] font-semibold text-white block mb-1">Creator Economy</span>
                    <p className="text-[14px] text-white/85 leading-[1.6]">Building platforms and tools that empower creators and celebrate human authenticity</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <span className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></span>
                  <div>
                    <span className="text-[15px] font-semibold text-white block mb-1">Rapid Iteration</span>
                    <p className="text-[14px] text-white/85 leading-[1.6]">Agile development with continuous feedback loops and data-driven optimization</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <span className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></span>
                  <div>
                    <span className="text-[15px] font-semibold text-white block mb-1">Scale & Impact</span>
                    <p className="text-[14px] text-white/85 leading-[1.6]">Designing for growth with sustainable architecture that creates lasting value</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Process Flow */}
            <div className="pt-6 border-t border-white/25">
              <p className="text-[14px] text-white/80 mb-4 font-medium">Our Process</p>
              <div className="flex flex-wrap items-center gap-4 text-[13px] text-white/70">
                <span className="font-medium">Discover</span>
                <span className="text-white/50">→</span>
                <span className="font-medium">Design</span>
                <span className="text-white/50">→</span>
                <span className="font-medium">Develop</span>
                <span className="text-white/50">→</span>
                <span className="font-medium">Deploy</span>
                <span className="text-white/50">→</span>
                <span className="font-medium">Scale</span>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default ApproachSection; 