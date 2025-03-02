'use client'

import { useState } from 'react'
import clsx from 'clsx/lite'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({
  currentPage,
  totalPages,
  onPageChangeAction,
}: {
  currentPage: number
  totalPages: number
  onPageChangeAction: (page: number) => void
}) {
  const [showInput, setShowInput] = useState<number | null>(null)

  const getPageNumbers = () => {
    const pageNumbers = []
    const maxVisiblePages = 3
    let start = Math.max(1, currentPage - 2)
    let end = Math.min(totalPages, start + maxVisiblePages - 1)

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible.
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    // Always show first page.
    pageNumbers.push(1)

    // Show ellipsis or number after first page.
    if (start > 2) {
      // -1 represents left ellipsis.
      pageNumbers.push(-1)
    } else if (start === 2) {
      pageNumbers.push(2)
    }

    // Push middle numbers.
    for (let i = Math.max(start, 2); i <= Math.min(end, totalPages - 1); i++) {
      pageNumbers.push(i)
    }

    // Show ellipsis or number before last page.
    if (end < totalPages - 1) {
      // -2 represents right ellipsis.
      pageNumbers.push(-2)
    } else if (end === totalPages - 1) {
      pageNumbers.push(totalPages - 1)
    }

    // Always show last page.
    if (totalPages > 1) {
      pageNumbers.push(totalPages)
    }

    return pageNumbers
  }

  const handleInputChange = (
    e: React.KeyboardEvent<HTMLInputElement>,
    position: number
  ) => {
    if (e.key === 'Enter') {
      const value = parseInt(e.currentTarget.value)
      if (!isNaN(value) && value >= 1 && value <= totalPages) {
        onPageChangeAction(value)
        setShowInput(null)
      }
      e.currentTarget.blur()
    } else if (e.key === 'Escape') {
      setShowInput(null)
      e.currentTarget.blur()
    }
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChangeAction(currentPage - 1)}
        disabled={currentPage === 1}
        className="inline-flex size-8 items-center justify-center rounded border border-zinc-300 py-1 text-sm transition-colors hover:bg-zinc-300 hover:duration-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-700"
      >
        <ChevronLeft size={20} />
      </button>

      {getPageNumbers().map((page, index) => {
        if (page < 0) {
          // Ellipsis
          if (showInput === page) {
            return (
              <input
                key={`input-${page}-${index}`}
                type="number"
                min={1}
                max={totalPages}
                autoFocus
                onKeyDown={(e) => handleInputChange(e, page)}
                onBlur={() => setShowInput(null)}
                className="size-8 appearance-none rounded border border-zinc-300 bg-transparent text-center text-sm dark:border-zinc-700 [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden"
              />
            )
          }
          return (
            <button
              key={`ellipsis-${page}-${index}`}
              onClick={() => setShowInput(page)}
              className="inline-flex size-8 items-center justify-center rounded border border-zinc-300 py-1 text-sm transition-colors hover:bg-zinc-300 hover:duration-0 dark:border-zinc-700 dark:hover:bg-zinc-700"
            >
              ...
            </button>
          )
        }

        return (
          <button
            key={`page-${page}-${index}`}
            onClick={() => onPageChangeAction(page)}
            className={clsx(
              'inline-flex size-8 items-center justify-center rounded border border-zinc-300 py-1 text-sm dark:border-zinc-700',
              page === currentPage
                ? 'bg-black text-white dark:bg-white dark:text-black'
                : 'transition-colors hover:bg-zinc-300 hover:duration-0 dark:hover:bg-zinc-700'
            )}
          >
            {page}
          </button>
        )
      })}

      <button
        onClick={() => onPageChangeAction(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="inline-flex size-8 items-center justify-center rounded border border-zinc-300 py-1 text-sm transition-colors hover:bg-zinc-300 hover:duration-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-700"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  )
}
