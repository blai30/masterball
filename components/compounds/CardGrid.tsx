'use client'

import { useMemo, useCallback, ReactNode } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Pagination from '@/components/compounds/Pagination'

type CardGridProps<T> = {
  data: T[]
  renderCardAction: (item: T) => ReactNode
  getKeyAction: (item: T) => string | number
  itemsPerPage?: number
  className?: string
  currentPage: number
  onPageChangeAction: (page: number) => void
}

export default function CardGrid<T>({
  data,
  renderCardAction,
  getKeyAction,
  itemsPerPage = 60,
  className,
  currentPage,
  onPageChangeAction,
}: CardGridProps<T>) {
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return data.slice(startIndex, endIndex)
  }, [data, currentPage, itemsPerPage])

  const totalPages = useMemo(() => {
    return Math.ceil(data.length / itemsPerPage)
  }, [data, itemsPerPage])

  const getKey = useCallback(getKeyAction, [])
  const renderCard = useCallback(renderCardAction, [])

  return (
    <div className="xs:gap-8 flex flex-col gap-4">
      <div className="xs:gap-8 flex flex-col gap-4">
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-zinc-500 dark:text-zinc-400">
            <span className="text-lg font-medium">No results found</span>
            <span className="text-sm font-normal">
              Check filters and/or version group dropdown
            </span>
          </div>
        ) : (
          <>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChangeAction={onPageChangeAction}
            />
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.ul
                  className={className}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.01,
                        delayChildren: 0.01,
                      },
                    },
                    exit: {
                      opacity: 0,
                      transition: {
                        duration: 0.01,
                      },
                    },
                  }}
                  key={currentPage}
                >
                  {paginatedItems.map((item) => (
                    <motion.li
                      key={getKey(item)}
                      layoutId={`card-${getKey(item)}`}
                      layout
                      className="col-span-1"
                      variants={{
                        hidden: { opacity: 0, y: 16 },
                        visible: {
                          opacity: 1,
                          y: 0,
                          transition: {
                            type: 'spring',
                            bounce: 0.1,
                            duration: 0.5,
                          },
                        },
                      }}
                      transition={{
                        layout: {
                          type: 'spring',
                          bounce: 0.1,
                          duration: 0.6,
                        },
                      }}
                    >
                      {renderCard(item)}
                    </motion.li>
                  ))}
                </motion.ul>
              </AnimatePresence>
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChangeAction={onPageChangeAction}
            />
          </>
        )}
      </div>
    </div>
  )
}
