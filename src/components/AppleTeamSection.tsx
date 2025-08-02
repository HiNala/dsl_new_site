"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Award, Briefcase, ExternalLink } from 'lucide-react';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  location: string;
  focus: string;
  edge: string;
  notables: string;
  skills: string;
  image: string;
  fullProfile: {
    bio: string;
    achievements: string[];
    expertise: string[];
    contact?: {
      linkedin?: string;
      github?: string;
      email?: string;
    };
  };
}

const AppleTeamSection: React.FC = () => {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: "Brian Permut",
      role: "Co‑founder & Full‑Stack Developer",
      location: "Rohnert Park / Bay Area, CA",
      focus: "Next.js/TypeScript/FastAPI apps, AI-driven SaaS, workflow automation",
      edge: "Michelin-level operations discipline meets disaster-response leadership with self-taught engineering mastery.",
      notables: "Built CRE8ABLE, PyroGuard, Rainmaker • $20k+ revenue • SF hackathons",
      skills: "Next.js • TypeScript • FastAPI • Python • Product Strategy",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      fullProfile: {
        bio: "Brian brings a unique combination of Michelin-level operations discipline and disaster-response leadership experience to his self-taught engineering expertise. He excels at zero-to-one builds, sales loops, and process optimization, making him invaluable for transforming ideas into market-ready products.",
        achievements: [
          "Built CRE8ABLE, PyroGuard, and Rainmaker with $20k+ recent revenue traction",
          "Active contributor to SF hackathon ecosystem",
          "Custom BESB design specialist",
          "Proven track record in product strategy and sales enablement"
        ],
        expertise: [
          "Full-stack web development",
          "Python automation and data products",
          "AI-driven SaaS platforms",
          "Product strategy and go-to-market",
          "Pitch writing and proposal development",
          "Process optimization and operations"
        ],
        contact: {
          email: "brian@digitalstudiolabs.com",
          linkedin: "#",
          github: "#"
        }
      }
    },
    {
      id: 2,
      name: "Alexander Permut",
      role: "Co‑Founder & CEO",
      location: "Berkeley / San Francisco, CA",
      focus: "Go‑to‑market strategy, creator/influencer partnerships, operations",
      edge: "Venture Studio leader with $120M+ real estate portfolio management experience and proven marketing expertise.",
      notables: "Led marketing at Kokua • Authored CRE e‑book • $120M+ portfolio",
      skills: "GTM Strategy • Creator Partnerships • Team Leadership • Marketing Ops",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      fullProfile: {
        bio: "Alexander leads Digital Studio Labs with extensive experience managing a $120M+ real estate portfolio. He's a proven marketer with data-driven growth playbooks and deep expertise in the creator economy, making him uniquely positioned to scale venture studio operations.",
        achievements: [
          "Managed $120M+ real estate portfolio with proven ROI",
          "Led marketing strategy at Kokua with measurable growth impact",
          "Authored comprehensive CRE investment e-book",
          "Built sophisticated ops systems across hospitality and rental sectors"
        ],
        expertise: [
          "Go-to-market strategy and execution",
          "Creator economy and influencer partnerships",
          "Budgeting, forecasting, and financial planning",
          "Stakeholder communications and team leadership",
          "Marketing operations and automation",
          "Property and asset management"
        ],
        contact: {
          email: "alexander@digitalstudiolabs.com",
          linkedin: "#"
        }
      }
    },
    {
      id: 3,
      name: "Sanket Deshpande",
      role: "ML/CV Engineer - \"Let's build something!\"",
      location: "SF Bay Area (TReNDS Center)",
      focus: "Computer Vision, 3D Reconstruction, Gaussian Splatting, Agentic AI",
      edge: "Production-grade modern C++ specialist shipping cutting-edge research tools and MCP-enabled systems.",
      notables: "IEEE publications • 3D CNN MRI prediction • 7x training speedup",
      skills: "PyTorch • OpenCV • FastAPI • LangChain • Docker • C++",
      image: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=400&h=400&fit=crop&crop=face",
      fullProfile: {
        bio: "Sanket is a production-grade modern C++ specialist who ships end-to-end research tools including Visual_PySLAM_Engine and MCP-enabled FastAPI Reddit RAG servers. His expertise spans from low-level optimization to high-level AI system architecture.",
        achievements: [
          "Published in IEEE ISBI & EMBS conferences",
          "3D CNN for MRI cognition prediction with 0.34 correlation",
          "Achieved 7x training speedup using DDP on SLURM",
          "Built Visual_PySLAM_Engine research tool",
          "Developed MCP-enabled FastAPI Reddit RAG server"
        ],
        expertise: [
          "Computer Vision and 3D Reconstruction",
          "Modern C++ and performance optimization",
          "PyTorch, OpenCV, and FastAPI development",
          "LangChain/Graph and RAG pipelines",
          "Pinecone/FAISS vector databases",
          "Docker containerization and SHAP/GradCAM"
        ],
        contact: {
          email: "sanket@digitalstudiolabs.com",
          github: "#"
        }
      }
    },
    {
      id: 4,
      name: "Salim Masmoudi",
      role: "Founder, Nouspo",
      location: "San Francisco Bay Area",
      focus: "Multimodal AI datasets, computer vision products, autonomous agents",
      edge: "Enterprise AI specialist delivering production CV/LLM solutions for Fortune 500 companies.",
      notables: "Met Yann LeCun • Shell/Coca-Cola client • 4+ years Nouspo",
      skills: "C++ • JavaScript • CV Pipelines • LLM Production • Data Engineering",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
      fullProfile: {
        bio: "Salim founded Nouspo, specializing in open-source data and agentic AI tooling. He delivers CV/LLM solutions for major enterprises including Shell, Coca-Cola, and Zenata, focusing on change detection, footfall analytics, and high-frequency QC systems.",
        achievements: [
          "Founded and ran Nouspo for 4+ years across multiple sectors",
          "Pitched at UM6P TechInnov Days and met Yann LeCun",
          "Delivered production solutions for Shell, Coca-Cola, and Zenata",
          "Specialized in change detection and footfall analytics",
          "Built high-frequency quality control systems"
        ],
        expertise: [
          "Multimodal AI datasets and computer vision",
          "C++ and JavaScript for production systems",
          "CV/LLM solution architecture and deployment",
          "Data engineering for AI applications",
          "Autonomous agents for enterprise use cases",
          "Open-source AI tooling development"
        ],
        contact: {
          email: "salim@digitalstudiolabs.com",
          linkedin: "#"
        }
      }
    }
  ];

  const openModal = (member: TeamMember) => {
    setSelectedMember(member);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedMember(null);
    document.body.style.overflow = 'unset';
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-white">
      
      {/* Content Container */}
      <div className="relative z-10 w-full h-full flex">
        
        {/* Left Side - Title (like Let's Create) */}
        <div className="flex-1 flex items-center justify-start pl-[4vw]">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-[400px]"
          >
            <h2 className="text-[clamp(48px,7vw,100px)] font-light leading-[1.1] text-[#4A90E2] mb-6">
              Our Team
            </h2>
            <p className="text-[clamp(16px,1.8vw,24px)] text-gray-700 leading-relaxed mb-8">
              Meet the visionary founders building the future of software
            </p>
            <div className="w-16 h-1 bg-[#4A90E2] mb-6"></div>
            <p className="text-[15px] text-gray-600 leading-[1.6]">
              Ready to build something extraordinary? We partner with visionary 
              founders and companies to create digital experiences that redefine 
              what's possible.
            </p>
          </motion.div>
        </div>

        {/* Right Side - Staggered Team Cards */}
        <div className="flex-1 flex items-center justify-center pr-[4vw] relative">
          <div className="relative w-full max-w-[900px]">
            
            {/* Top Row - Left Aligned */}
            <div className="flex space-x-6 mb-8">
              {teamMembers.slice(0, 2).map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 30, x: -20 }}
                  animate={{ opacity: 1, y: 0, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 + index * 0.15 }}
                  className="group cursor-pointer w-[420px]"
                  onClick={() => openModal(member)}
                >
                  <div className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-500 hover:border-[#4A90E2]/50 overflow-hidden h-[240px] hover:-translate-y-2 rounded-lg">
                    <div className="flex h-full">
                      {/* Image - Left Side */}
                      <div className="relative w-40 overflow-hidden flex-shrink-0">
                        <motion.img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      
                      {/* Content - Right Side */}
                      <div className="flex-1 p-5 flex flex-col justify-between">
                        <div className="flex-1">
                          <h3 className="text-[18px] font-bold text-gray-900 group-hover:text-[#4A90E2] transition-colors duration-300 mb-2 leading-tight">
                            {member.name}
                          </h3>
                          <p className="text-[14px] font-semibold text-[#4A90E2] mb-3 line-clamp-2">
                            {member.role}
                          </p>
                          <p className="text-[13px] text-gray-600 line-clamp-3 leading-relaxed flex-1">
                            {member.edge}
                          </p>
                        </div>
                        
                        <div className="text-[13px] text-[#4A90E2] font-medium flex items-center group-hover:translate-x-1 transition-transform duration-300 mt-3">
                          Learn more →
                        </div>
                      </div>
                    </div>
                    
                    {/* Hover indicator */}
                    <div className="h-1 bg-gradient-to-r from-[#4A90E2] to-blue-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Bottom Row - Right Offset */}
            <div className="flex space-x-6 ml-16">
              {teamMembers.slice(2, 4).map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 30, x: 20 }}
                  animate={{ opacity: 1, y: 0, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.7 + index * 0.15 }}
                  className="group cursor-pointer w-[420px]"
                  onClick={() => openModal(member)}
                >
                  <div className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-500 hover:border-[#4A90E2]/50 overflow-hidden h-[240px] hover:-translate-y-2 rounded-lg">
                    <div className="flex h-full">
                      {/* Image - Left Side */}
                      <div className="relative w-40 overflow-hidden flex-shrink-0">
                        <motion.img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      
                      {/* Content - Right Side */}
                      <div className="flex-1 p-5 flex flex-col justify-between">
                        <div className="flex-1">
                          <h3 className="text-[18px] font-bold text-gray-900 group-hover:text-[#4A90E2] transition-colors duration-300 mb-2 leading-tight">
                            {member.name}
                          </h3>
                          <p className="text-[14px] font-semibold text-[#4A90E2] mb-3 line-clamp-2">
                            {member.role}
                          </p>
                          <p className="text-[13px] text-gray-600 line-clamp-3 leading-relaxed flex-1">
                            {member.edge}
                          </p>
                        </div>
                        
                        <div className="text-[13px] text-[#4A90E2] font-medium flex items-center group-hover:translate-x-1 transition-transform duration-300 mt-3">
                          Learn more →
                        </div>
                      </div>
                    </div>
                    
                    {/* Hover indicator */}
                    <div className="h-1 bg-gradient-to-r from-[#4A90E2] to-blue-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                  </div>
                </motion.div>
              ))}
            </div>
            
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
                         <motion.div
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="bg-white w-full max-w-full h-[90vh] overflow-y-auto shadow-2xl relative mx-4"
               onClick={(e) => e.stopPropagation()}
             >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 p-2 bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="relative h-48 bg-gradient-to-r from-[#4A90E2] to-blue-500 overflow-hidden">
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative h-full flex items-end p-8">
                  <div className="flex items-end space-x-6">
                    <img
                      src={selectedMember.image}
                      alt={selectedMember.name}
                      className="w-24 h-24 object-cover border-4 border-white shadow-lg"
                    />
                    <div className="text-white pb-2">
                      <h2 className="text-3xl font-bold mb-1">{selectedMember.name}</h2>
                      <p className="text-lg opacity-90">{selectedMember.role}</p>
                      <div className="flex items-center mt-2 opacity-80">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="text-sm">{selectedMember.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 space-y-6">
                {/* Bio */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">About</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedMember.fullProfile.bio}</p>
                </div>

                {/* Focus Area */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                    <Briefcase className="w-5 h-5 mr-2 text-[#4A90E2]" />
                    Focus Areas
                  </h3>
                  <p className="text-gray-700">{selectedMember.focus}</p>
                </div>

                {/* Achievements */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                    <Award className="w-5 h-5 mr-2 text-[#4A90E2]" />
                    Key Achievements
                  </h3>
                  <ul className="space-y-2">
                    {selectedMember.fullProfile.achievements.map((achievement, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-[#4A90E2] rounded-full mt-2 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Expertise */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Core Expertise</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedMember.fullProfile.expertise.map((skill, index) => (
                      <div key={index} className="bg-gray-50 p-3 text-sm text-gray-700 border-l-4 border-[#4A90E2]">
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact */}
                {selectedMember.fullProfile.contact && (
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Connect</h3>
                    <div className="flex space-x-4">
                      {selectedMember.fullProfile.contact.email && (
                        <a href={`mailto:${selectedMember.fullProfile.contact.email}`} 
                           className="text-[#4A90E2] hover:text-blue-600 transition-colors duration-200 text-sm">
                          {selectedMember.fullProfile.contact.email}
                        </a>
                      )}
                      {selectedMember.fullProfile.contact.linkedin && (
                        <a href={selectedMember.fullProfile.contact.linkedin} 
                           className="text-[#4A90E2] hover:text-blue-600 transition-colors duration-200 text-sm flex items-center">
                          LinkedIn <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      )}
                      {selectedMember.fullProfile.contact.github && (
                        <a href={selectedMember.fullProfile.contact.github} 
                           className="text-[#4A90E2] hover:text-blue-600 transition-colors duration-200 text-sm flex items-center">
                          GitHub <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AppleTeamSection; 