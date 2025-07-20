"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  User, 
  Briefcase, 
  FileText, 
  Menu, 
  X, 
  ChevronLeft, 
  ChevronRight
} from 'lucide-react';

interface NavigationItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}

interface NavigationProps {
  className?: string;
}

// Navigation items
const navigationItems: NavigationItem[] = [
  { id: "home", name: "Home", icon: Home, href: "#" },
  { id: "about", name: "About", icon: User, href: "#about" },
  { id: "projects", name: "Projects", icon: Briefcase, href: "#projects" },
  { id: "contact", name: "Contact", icon: FileText, href: "#contact" },
];

export function PillNavigation({ className = "" }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("home");

  // Auto-open navigation on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleNavigation = () => setIsOpen(!isOpen);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const handleItemClick = (itemId: string) => {
    setActiveItem(itemId);
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  // Animation variants
  const sidebarVariants = {
    expanded: {
      width: "280px",
      transition: {
        type: "spring" as const,
        damping: 20,
        stiffness: 300
      }
    },
    collapsed: {
      width: "80px",
      transition: {
        type: "spring" as const,
        damping: 20,
        stiffness: 300
      }
    }
  };

  const itemTextVariants = {
    expanded: {
      opacity: 1,
      x: 0,
      display: "block",
      transition: {
        duration: 0.2,
        delay: 0.1
      }
    },
    collapsed: {
      opacity: 0,
      x: -10,
      transitionEnd: {
        display: "none"
      },
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <>
      {/* Mobile hamburger button */}
      <motion.button
        onClick={toggleNavigation}
        className="fixed top-6 left-6 z-50 p-3 rounded-xl bg-white/20 backdrop-blur-md shadow-lg border border-black/20 md:hidden hover:bg-white/30 transition-all duration-200"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Toggle navigation"
      >
        {isOpen ? 
          <X className="h-5 w-5 text-black" /> : 
          <Menu className="h-5 w-5 text-black" />
        }
      </motion.button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden" 
            onClick={toggleNavigation} 
          />
        )}
      </AnimatePresence>

      {/* Navigation sidebar */}
      <motion.div
        variants={sidebarVariants}
        initial="expanded"
        animate={isCollapsed ? "collapsed" : "expanded"}
        className={`
          fixed top-0 left-0 h-full z-40 transition-all duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          bg-white/10 backdrop-blur-xl border-r border-black/20 shadow-xl
          ${className}
        `}
      >
        {/* Header with logo and collapse button */}
        <div className="flex items-center justify-between p-5 border-b border-black/20">
          <motion.div 
            className="flex items-center space-x-2.5"
            animate={{ opacity: isCollapsed ? 0 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-9 h-9 bg-black/20 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-black font-bold text-base">D</span>
            </div>
            <motion.div 
              className="flex flex-col"
              variants={itemTextVariants}
            >
              <span className="font-semibold text-black text-base">Digital Studio</span>
              <span className="text-xs text-black/60">Labs</span>
            </motion.div>
          </motion.div>

          {isCollapsed && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-9 h-9 bg-black/20 rounded-lg flex items-center justify-center mx-auto shadow-sm"
            >
              <span className="text-black font-bold text-base">D</span>
            </motion.div>
          )}

          {/* Desktop collapse button */}
          <motion.button
            onClick={toggleCollapse}
            className="hidden md:flex p-1.5 rounded-md hover:bg-black/10 transition-all duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={isCollapsed ? "Expand navigation" : "Collapse navigation"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 text-black/60" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-black/60" />
            )}
          </motion.button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 overflow-y-auto">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;

              return (
                <li key={item.id}>
                  <motion.button
                    onClick={() => handleItemClick(item.id)}
                    className={`
                      w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-left transition-all duration-200 group
                      ${isActive
                        ? "bg-black/20 text-black"
                        : "text-black/70 hover:bg-black/10 hover:text-black"
                      }
                      ${isCollapsed ? "justify-center px-2" : ""}
                    `}
                    whileHover={{ 
                      scale: 1.02,
                      backgroundColor: isActive ? "rgba(0,0,0,0.25)" : "rgba(0,0,0,0.15)"
                    }}
                    whileTap={{ scale: 0.98 }}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <motion.div 
                      className="flex items-center justify-center min-w-[24px]"
                                             whileHover={{ rotate: isActive ? 0 : 10 }}
                       transition={{ type: "spring" as const, stiffness: 400, damping: 10 }}
                    >
                      <Icon
                        className={`
                          h-5 w-5 flex-shrink-0
                          ${isActive 
                            ? "text-black" 
                            : "text-black/60 group-hover:text-black"
                          }
                        `}
                      />
                    </motion.div>
                    
                    <motion.div 
                      className="flex items-center justify-between w-full"
                      variants={itemTextVariants}
                    >
                      <span className={`text-sm ${isActive ? "font-medium" : "font-normal"}`}>{item.name}</span>
                    </motion.div>
                  </motion.button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom section */}
        <div className="mt-auto border-t border-black/20 p-4">
          <motion.div 
            className={`text-center ${isCollapsed ? 'px-2' : 'px-3'}`}
            variants={itemTextVariants}
          >
            <p className="text-xs text-black/50">Ultra Modern Nav</p>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
} 