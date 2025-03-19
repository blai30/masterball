'use client'

import { useRef, useState, useEffect } from 'react'
import clsx from 'clsx/lite'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function HorizontalScroller({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)
  const checkPositionRef = useRef<number | null>(null)

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) return

    const checkScrollPosition = () => {
      setShowLeftArrow(scrollContainer.scrollLeft > 0)
      setShowRightArrow(
        scrollContainer.scrollLeft <
          scrollContainer.scrollWidth - scrollContainer.clientWidth - 10
      )
    }

    // Run initial check
    checkScrollPosition()

    // Use passive listener to tell browser we don't prevent default
    const controller = new AbortController()

    // Throttle scroll events by using requestAnimationFrame
    const handleScroll = () => {
      if (checkPositionRef.current === null) {
        checkPositionRef.current = requestAnimationFrame(() => {
          checkScrollPosition()
          checkPositionRef.current = null
        })
      }
    }

    scrollContainer.addEventListener('scroll', handleScroll, {
      signal: controller.signal,
      passive: true,
    })

    const handleResize = () => {
      checkScrollPosition()
    }

    window.addEventListener('resize', handleResize, {
      signal: controller.signal,
      passive: true,
    })

    return () => {
      controller.abort()
      if (checkPositionRef.current !== null) {
        cancelAnimationFrame(checkPositionRef.current)
      }
    }
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) return

    const scrollAmount = 278
    const newScrollLeft =
      direction === 'left'
        ? scrollContainer.scrollLeft - scrollAmount
        : scrollContainer.scrollLeft + scrollAmount

    scrollContainer.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth',
    })
  }

  return (
    <div className="relative">
      {showLeftArrow && (
        <button
          onClick={() => scroll('left')}
          className="absolute top-1/2 left-8 z-10 -translate-y-1/2 rounded-full bg-white/40 p-2 text-black inset-ring-2 inset-ring-black backdrop-blur-lg dark:bg-black/40 dark:text-white dark:inset-ring-white"
          aria-label="Scroll left"
        >
          <ChevronLeft size={24} />
        </button>
      )}

      <div
        ref={scrollContainerRef}
        className={clsx('overflow-x-auto', className)}
      >
        {children}
      </div>

      {showRightArrow && (
        <button
          onClick={() => scroll('right')}
          className="absolute top-1/2 right-8 z-10 -translate-y-1/2 rounded-full bg-white/40 p-2 text-black inset-ring-2 inset-ring-black backdrop-blur-lg dark:bg-black/40 dark:text-white dark:inset-ring-white"
          aria-label="Scroll right"
        >
          <ChevronRight size={24} />
        </button>
      )}
    </div>
  )
}
