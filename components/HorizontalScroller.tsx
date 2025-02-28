'use client'

import { useEffect, useRef, useState } from 'react'
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

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) return

    // Check if arrows should be shown
    const checkScrollPosition = () => {
      setShowLeftArrow(scrollContainer.scrollLeft > 0)
      setShowRightArrow(
        scrollContainer.scrollLeft <
          scrollContainer.scrollWidth - scrollContainer.clientWidth - 10
      )
    }

    // TODO use abort signal controller
    checkScrollPosition()
    scrollContainer.addEventListener('scroll', checkScrollPosition)
    window.addEventListener('resize', checkScrollPosition)

    return () => {
      scrollContainer.removeEventListener('scroll', checkScrollPosition)
      window.removeEventListener('resize', checkScrollPosition)
    }
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) return

    const scrollAmount = 278 // Adjust as needed
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
    <div className={clsx('relative w-full', className)}>
      {/* Left scroll button */}
      {showLeftArrow && (
        <button
          onClick={() => scroll('left')}
          className="absolute top-1/2 left-2 z-10 -translate-y-1/2 rounded-full bg-white/40 p-2 text-black inset-ring-2 inset-ring-black backdrop-blur-lg dark:bg-black/40 dark:text-white dark:inset-ring-white"
          aria-label="Scroll left"
        >
          <ChevronLeft size={24} />
        </button>
      )}

      <div ref={scrollContainerRef} className="overflow-x-auto">
        {children}
      </div>

      {/* Right scroll button */}
      {showRightArrow && (
        <button
          onClick={() => scroll('right')}
          className="absolute top-1/2 right-2 z-10 -translate-y-1/2 rounded-full bg-white/40 p-2 text-black inset-ring-2 inset-ring-black backdrop-blur-lg dark:bg-black/40 dark:text-white dark:inset-ring-white"
          aria-label="Scroll right"
        >
          <ChevronRight size={24} />
        </button>
      )}
    </div>
  )
}
