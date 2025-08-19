"use client"

import { useEffect } from 'react'

export default function ScrollSnapManager() {
  useEffect(() => {
    let isScrolling = false
    let scrollTimeout: NodeJS.Timeout
    let isAnimating = false
    let wheelCooldownUntil = 0
    const COOLDOWN_MS = 700

    const handleScroll = () => {
      const scrollContainer = document.querySelector('.scroll-container') as HTMLElement
      if (!scrollContainer) return

      // Clear existing timeout
      clearTimeout(scrollTimeout)
      
      // Set scrolling flag
      isScrolling = true
      
      if (isAnimating) return // ignore intermediate events while animating
      // Debounce scroll end detection
      scrollTimeout = setTimeout(() => {
        isScrolling = false
        snapToNearestSection()
      }, 150)
    }

    const snapToNearestSection = () => {
      const scrollContainer = document.querySelector('.scroll-container') as HTMLElement
      if (!scrollContainer) return

      const sections = scrollContainer.querySelectorAll('section')
      const scrollTop = scrollContainer.scrollTop
      const containerHeight = scrollContainer.clientHeight

      let nearestSection: HTMLElement | null = null
      let minDistance = Infinity

      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop
        const distance = Math.abs(scrollTop - sectionTop)
        
        if (distance < minDistance) {
          minDistance = distance
          nearestSection = section as HTMLElement
        }
      })

      if (nearestSection && minDistance > 10) {
        // Smooth scroll to the nearest section
        scrollContainer.scrollTo({
          top: nearestSection.offsetTop,
          behavior: 'smooth'
        })
      }
    }

    const handleWheel = (e: WheelEvent) => {
      const scrollContainer = document.querySelector('.scroll-container') as HTMLElement
      if (!scrollContainer) return

      // Prevent default to control scroll behavior
      e.preventDefault()

      // Ignore wheel while animating or within cooldown to avoid skipping multiple sections
      const now = Date.now()
      if (isAnimating || now < wheelCooldownUntil) {
        return
      }

      // Apply a larger deadzone and use sign only to reduce overshooting
      const DEADZONE = 80
      const delta = Math.abs(e.deltaY) < DEADZONE ? 0 : Math.sign(e.deltaY)
      if (delta === 0) return
      const sections = Array.from(scrollContainer.querySelectorAll('section')) as HTMLElement[]
      const scrollTop = scrollContainer.scrollTop
      const containerHeight = scrollContainer.clientHeight

      // Find current section
      let currentSectionIndex = 0
      for (let i = 0; i < sections.length; i++) {
        if (scrollTop >= sections[i].offsetTop - containerHeight * 0.5) {
          currentSectionIndex = i
        }
      }

      // Determine next section based on scroll direction
      let targetIndex = currentSectionIndex
      if (delta > 0 && currentSectionIndex < sections.length - 1) {
        targetIndex = currentSectionIndex + 1
      } else if (delta < 0 && currentSectionIndex > 0) {
        targetIndex = currentSectionIndex - 1
      }

      // Scroll to target section with improved smoothness
      if (targetIndex !== currentSectionIndex) {
        isAnimating = true
        wheelCooldownUntil = now + COOLDOWN_MS
        scrollContainer.scrollTo({
          top: sections[targetIndex].offsetTop,
          behavior: 'smooth'
        })
        
        // Reset animation flag after scroll completes
        setTimeout(() => {
          isAnimating = false
        }, COOLDOWN_MS)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      const scrollContainer = document.querySelector('.scroll-container') as HTMLElement
      if (!scrollContainer) return

      const sections = Array.from(scrollContainer.querySelectorAll('section')) as HTMLElement[]
      const scrollTop = scrollContainer.scrollTop
      const containerHeight = scrollContainer.clientHeight

      // Find current section
      let currentSectionIndex = 0
      for (let i = 0; i < sections.length; i++) {
        if (scrollTop >= sections[i].offsetTop - containerHeight * 0.5) {
          currentSectionIndex = i
        }
      }

      let targetIndex = currentSectionIndex

      switch (e.key) {
        case 'ArrowDown':
        case 'PageDown':
        case ' ': // Space bar
          e.preventDefault()
          if (currentSectionIndex < sections.length - 1) {
            targetIndex = currentSectionIndex + 1
          }
          break
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault()
          if (currentSectionIndex > 0) {
            targetIndex = currentSectionIndex - 1
          }
          break
        case 'Home':
          e.preventDefault()
          targetIndex = 0
          break
        case 'End':
          e.preventDefault()
          targetIndex = sections.length - 1
          break
      }

      if (targetIndex !== currentSectionIndex) {
        scrollContainer.scrollTo({
          top: sections[targetIndex].offsetTop,
          behavior: 'smooth'
        })
      }
    }

    // Add event listeners
    const scrollContainer = document.querySelector('.scroll-container')
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true })
      scrollContainer.addEventListener('wheel', handleWheel, { passive: false })
      document.addEventListener('keydown', handleKeyDown)
    }

    // Cleanup
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll)
        scrollContainer.removeEventListener('wheel', handleWheel)
        document.removeEventListener('keydown', handleKeyDown)
      }
      clearTimeout(scrollTimeout)
    }
  }, [])

  return null // This component only manages scroll behavior
}