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
        <div className="flex items-center gap-2 bg-black/10 backdrop-blur-xl border border-black/30 rounded-2xl px-3 py-3 shadow-2xl shadow-black/10">
          {items.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.name

            return (
              <motion.button
                key={item.name}
                onClick={() => handleItemClick(item.name)}
                className={cn(
                  "relative px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300",
                  "hover:text-gray-500",
                  isActive 
                    ? "text-black" 
                    : "text-black hover:text-gray-500"
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
                      className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-xl border border-black/40"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                    <motion.div
                      layoutId="pill-glow"
                      className="absolute inset-0 bg-gradient-to-r from-blue-500/30 via-blue-300/20 to-white/30 rounded-xl blur-sm"
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
        <div className="bg-black/10 backdrop-blur-xl border border-black/30 rounded-2xl shadow-2xl shadow-black/10">
          {!isMenuOpen ? (
            <div className="flex items-center gap-1 px-3 py-3">
              {items.slice(0, 3).map((item) => {
                const Icon = item.icon
                const isActive = activeTab === item.name

                return (
                  <motion.button
                    key={item.name}
                    onClick={() => handleItemClick(item.name)}
                    className={cn(
                      "relative p-3 rounded-xl transition-all duration-300",
                      isActive 
                        ? "text-black" 
                        : "text-black hover:text-gray-500"
                    )}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Icon size={18} strokeWidth={2} />
                    {isActive && (
                      <motion.div
                        layoutId="mobile-pill-bg"
                        className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-xl border border-black/40"
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
                className="p-3 rounded-xl text-black hover:text-gray-500 transition-colors"
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
              className="flex items-center gap-1 px-3 py-3"
            >
              {items.map((item) => {
                const Icon = item.icon
                const isActive = activeTab === item.name

                return (
                  <motion.button
                    key={item.name}
                    onClick={() => handleItemClick(item.name)}
                    className={cn(
                      "relative p-3 rounded-xl transition-all duration-300",
                      isActive 
                        ? "text-black" 
                        : "text-black hover:text-gray-500"
                    )}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Icon size={18} strokeWidth={2} />
                    {isActive && (
                      <motion.div
                        layoutId="mobile-expanded-pill-bg"
                        className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-xl border border-black/40"
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
                className="p-3 rounded-xl text-black hover:text-gray-500 transition-colors"
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