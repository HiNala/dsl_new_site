'use client'

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Home, User, Briefcase, FileText, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  url: string
  icon: React.ElementType
}

interface PillNavigationProps {
  items?: NavItem[]
  className?: string
}

export function PillNavigation({ 
  items = [
    { name: 'Home', url: '#', icon: Home },
    { name: 'About', url: '#about', icon: User },
    { name: 'Projects', url: '#projects', icon: Briefcase },
    { name: 'Contact', url: '#contact', icon: FileText }
  ],
  className 
}: PillNavigationProps) {
  const [activeTab, setActiveTab] = useState(items[0].name)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleItemClick = (itemName: string) => {
    setActiveTab(itemName)
    setIsMenuOpen(false)
  }

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={cn(
          "fixed top-6 left-1/2 -translate-x-1/2 z-50 hidden md:block",
          className
        )}
      >
        <div className="flex items-center gap-2 bg-gray-500/10 backdrop-blur-xl border border-gray-400/30 rounded-full px-2 py-2 shadow-2xl shadow-black/10">
          {items.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.name

            return (
              <motion.button
                key={item.name}
                onClick={() => handleItemClick(item.name)}
                className={cn(
                  "relative px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
                  "hover:text-gray-300",
                  isActive 
                    ? "text-gray-200" 
                    : "text-gray-400 hover:text-gray-300"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Icon size={16} strokeWidth={2} />
                  {item.name}
                </span>
                
                {isActive && (
                  <>
                    <motion.div
                      layoutId="pill-bg"
                      className="absolute inset-0 bg-gray-500/20 backdrop-blur-sm rounded-full border border-gray-400/40"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                    <motion.div
                      layoutId="pill-glow"
                      className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/10 to-pink-500/20 rounded-full blur-sm"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  </>
                )}
              </motion.button>
            )
          })}
        </div>
      </motion.nav>

      {/* Mobile Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={cn(
          "fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden",
          className
        )}
      >
        <div className="bg-gray-500/10 backdrop-blur-xl border border-gray-400/30 rounded-full shadow-2xl shadow-black/10">
          {!isMenuOpen ? (
            <div className="flex items-center gap-1 px-2 py-2">
              {items.slice(0, 3).map((item) => {
                const Icon = item.icon
                const isActive = activeTab === item.name

                return (
                  <motion.button
                    key={item.name}
                    onClick={() => handleItemClick(item.name)}
                    className={cn(
                      "relative p-3 rounded-full transition-all duration-300",
                      isActive 
                        ? "text-gray-200" 
                        : "text-gray-400"
                    )}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Icon size={18} strokeWidth={2} />
                    {isActive && (
                      <motion.div
                        layoutId="mobile-pill-bg"
                        className="absolute inset-0 bg-gray-500/20 backdrop-blur-sm rounded-full border border-gray-400/40"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}
                  </motion.button>
                )
              })}
              
              <motion.button
                onClick={() => setIsMenuOpen(true)}
                className="p-3 rounded-full text-gray-400 hover:text-gray-300 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Menu size={18} strokeWidth={2} />
              </motion.button>
            </div>
          ) : (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-1 px-2 py-2"
            >
              {items.map((item) => {
                const Icon = item.icon
                const isActive = activeTab === item.name

                return (
                  <motion.button
                    key={item.name}
                    onClick={() => handleItemClick(item.name)}
                    className={cn(
                      "relative p-3 rounded-full transition-all duration-300",
                      isActive 
                        ? "text-gray-200" 
                        : "text-gray-400"
                    )}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Icon size={18} strokeWidth={2} />
                    {isActive && (
                      <motion.div
                        layoutId="mobile-expanded-pill-bg"
                        className="absolute inset-0 bg-gray-500/20 backdrop-blur-sm rounded-full border border-gray-400/40"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}
                  </motion.button>
                )
              })}
              
              <motion.button
                onClick={() => setIsMenuOpen(false)}
                className="p-3 rounded-full text-gray-400 hover:text-gray-300 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={18} strokeWidth={2} />
              </motion.button>
            </motion.div>
          )}
        </div>
      </motion.nav>
    </>
  )
} 