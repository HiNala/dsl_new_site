"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  location: string;
  edge: string;
  notables: string;
  skills: string;
  image: string;
}

const AppleTeamSection: React.FC = () => {
  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: "Brian Permut",
      role: "Co‑founder & Full‑Stack Developer",
      location: "Rohnert Park / Bay Area, CA",
      edge: "Michelin-level operations discipline meets disaster-response leadership with self-taught engineering mastery. Exceptional at zero‑to‑one builds, sales loops, and process optimization.",
      notables: "Built CRE8ABLE, PyroGuard, Rainmaker generating $20k+ revenue • Active SF hackathon contributor • Custom BESB design specialist",
      skills: "Next.js/TypeScript/FastAPI • AI-driven SaaS • Product strategy • Sales enablement • Pitch writing",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "Alexander Permut",
      role: "Co‑Founder & CEO",
      location: "Berkeley / San Francisco, CA",
      edge: "Venture Studio leader with $120M+ real estate portfolio management. Proven marketer with data-driven growth playbooks and creator economy expertise.",
      notables: "Led marketing strategy at Kokua • Authored CRE investment e‑book • Built ops systems across hospitality & rentals",
      skills: "GTM strategy • Creator partnerships • Budgeting & forecasting • Team leadership • Marketing ops",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "Sanket Deshpande",
      role: "ML/CV Engineer - \"Let's build something!\"",
      location: "SF Bay Area (TReNDS Center)",
      edge: "Production-grade modern C++ specialist shipping Visual_PySLAM_Engine and MCP-enabled FastAPI Reddit RAG server (Dockerized, Pinecone, Gemini).",
      notables: "IEEE ISBI & EMBS publications • 3D CNN MRI prediction (0.34 corr) • DDP on SLURM (7x training speedup)",
      skills: "PyTorch/OpenCV/FastAPI • LangChain/Graph • Pinecone/FAISS • Docker/PRAW • SHAP/GradCAM",
      image: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=400&h=400&fit=crop&crop=face"
    },
    {
      id: 4,
      name: "Salim Masmoudi",
      role: "Founder, Nouspo",
      location: "San Francisco Bay Area",
      edge: "Enterprise AI specialist delivering CV/LLM solutions for Shell, Coca‑Cola, Zenata. Expert in change detection, footfall analytics, and high-frequency QC systems.",
      notables: "Met Yann LeCun at UM6P TechInnov Days • 4+ years running Nouspo • Multi-sector contracting experience",
      skills: "C++/JavaScript • CV pipelines • LLM productization • Data engineering • Multimodal AI datasets",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face"
    }
  ];

  return (
    <div className="w-full max-w-[1300px] mx-auto px-4">
      {/* 2x2 Grid - Rectangular Cards */}
      <div className="grid grid-cols-2 gap-6 h-[545px]">
        {teamMembers.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="group cursor-pointer h-full"
          >
            <div className="relative h-full bg-white border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 hover:border-[#4A90E2]/50 overflow-hidden">
              {/* Rectangular Card Layout */}
              <div className="flex h-full">
                {/* Left Side - Image (1/4 width) - Full Area */}
                <div className="relative overflow-hidden" style={{ flexBasis: '25%' }}>
                  <motion.div
                    className="w-full h-full relative group-hover:scale-105 transition-transform duration-300"
                    whileHover={{ scale: 1.02 }}
                  >
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                    {/* Subtle overlay on hover */}
                    <div className="absolute inset-0 bg-[#4A90E2]/0 group-hover:bg-[#4A90E2]/10 transition-all duration-300" />
                  </motion.div>
                </div>

                {/* Right Side - Content (3/4 width) */}
                <div className="flex flex-col justify-center p-5" style={{ flexBasis: '75%' }}>
                  {/* Name */}
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#4A90E2] transition-colors duration-300 mb-2">
                    {member.name}
                  </h3>

                  {/* Role */}
                  <p className="text-sm font-semibold text-[#4A90E2] mb-2">
                    {member.role}
                  </p>

                  {/* Location */}
                  <p className="text-xs text-gray-500 mb-3">
                    {member.location}
                  </p>

                  {/* Edge */}
                  <p className="text-sm text-gray-700 leading-relaxed mb-3 line-clamp-2">
                    {member.edge}
                  </p>

                  {/* Notables */}
                  <div className="bg-gray-50 rounded-lg p-2 mb-2 group-hover:bg-[#4A90E2]/5 transition-colors duration-300">
                    <p className="text-xs text-gray-600 font-medium line-clamp-1">
                      {member.notables}
                    </p>
                  </div>

                  {/* Skills */}
                  <p className="text-xs text-gray-500 line-clamp-1">
                    {member.skills}
                  </p>
                </div>
              </div>

              {/* Hover indicator */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4A90E2] to-blue-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AppleTeamSection; 