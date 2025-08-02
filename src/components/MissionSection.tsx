"use client";

import React from 'react';
import { motion } from 'framer-motion';

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

      <div className="relative flex-1">
        
        {/* Large Artistic Image - Left Side with Off-Top Effect and Space Below */}
        <div className="absolute left-[1vw] top-[0px] bottom-[120px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.1 }}
            viewport={{ once: true }}
            className="relative h-full w-[520px]"
          >
            <div className="relative w-full h-full overflow-hidden">
              {/* Image extending off top, rounded bottom corners only with artistic spacing */}
              <div className="w-full h-full rounded-b-[2.5rem] overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&h=800&fit=crop&crop=center"
                  alt="Innovation and creativity"
                  className="w-full h-full object-cover"
                />
                {/* Clean subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Main Headline - positioned on the right with more spacing from image */}
        <div className="absolute right-[1.5vw] top-[70px]">
          <motion.h1 
            className="text-[clamp(38px,5.0vw,105px)] font-light leading-[1.1] text-white max-w-[45vw]"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            We build beautiful,<br />
            functional software that<br />
            shapes tomorrow.
          </motion.h1>
        </div>

      </div>
    </div>
  );
};

export default MissionSection; 