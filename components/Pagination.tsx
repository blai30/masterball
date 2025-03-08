'use client'

import { useState } from 'react'
import clsx from 'clsx/lite'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const getPageNumbers = (current: number, total: number) => {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  if (current <= 3) {
    return [1, 2, 3, 4, '...', total]
  }
  if (current >= total - 2) {
    return [1, '...', total - 3, total - 2, total - 1, total]
  }
  return [1, '...', current - 1, current, current + 1, '...', total]
}

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
    <div className="flex flex-wrap items-center justify-between text-sm/8">
      <button
        onClick={() => onPageChangeAction(currentPage - 1)}
        disabled={currentPage === 1}
        className="inline-flex h-[1lh] min-w-8 items-center justify-center rounded border border-zinc-300 px-1.5 py-1 transition-colors hover:bg-zinc-300 hover:duration-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-700"
      >
        <ChevronLeft size={20} className="" />
        <span className="px-2">Previous</span>
      </button>

      <div className="xs:flex hidden items-center justify-center gap-2">
        {getPageNumbers(currentPage, totalPages).map((page, index) => {
          if (page === '...') {
            // Ellipsis
            if (showInput === index) {
              return (
                <input
                  key={`input-${index}`}
                  type="number"
                  min={1}
                  max={totalPages}
                  autoFocus
                  onKeyDown={(e) => handleInputChange(e, index)}
                  onBlur={() => setShowInput(null)}
                  className="h-[1lh] min-w-8 appearance-none rounded border border-zinc-300 bg-transparent text-center dark:border-zinc-700 [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden"
                />
              )
            }
            return (
              <button
                key={`ellipsis-${index}`}
                onClick={() => setShowInput(index)}
                className="inline-flex h-[1lh] min-w-8 items-center justify-center rounded border border-zinc-300 py-1 transition-colors hover:bg-zinc-300 hover:duration-0 dark:border-zinc-700 dark:hover:bg-zinc-700"
              >
                ...
              </button>
            )
          }

          return (
            <button
              key={`page-${page}-${index}`}
              onClick={() =>
                typeof page === 'number' && onPageChangeAction(page)
              }
              className={clsx(
                'inline-flex h-[1lh] min-w-8 items-center justify-center rounded border border-zinc-300 py-1 dark:border-zinc-700',
                page === currentPage
                  ? 'bg-black text-white dark:bg-white dark:text-black'
                  : 'transition-colors hover:bg-zinc-300 hover:duration-0 dark:hover:bg-zinc-700'
              )}
            >
              {page}
            </button>
          )
        })}
      </div>

      <button
        onClick={() => onPageChangeAction(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="inline-flex h-[1lh] min-w-24 items-center justify-center rounded border border-zinc-300 px-1.5 py-1 transition-colors hover:bg-zinc-300 hover:duration-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-700"
      >
        <span className="px-2">Next</span>
        <ChevronRight size={20} className="" />
      </button>
    </div>
  )
}
