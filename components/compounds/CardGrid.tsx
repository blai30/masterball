'use client'

import { useMemo, useCallback, ReactNode } from 'react'
import { motion } from 'motion/react'
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
          <div className="flex flex-col items-center justify-center py-12 text-zinc-500 dark:text-zinc-400">
            <span className="text-lg font-medium">No results found</span>
          </div>
        ) : (
          <>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChangeAction={onPageChangeAction}
            />
            <motion.ul
              className={className}
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.01,
                  },
                },
              }}
              key={currentPage + '-' + paginatedItems.length}
            >
              {paginatedItems.map((item, idx) => (
                <motion.li
                  key={getKey(item)}
                  className="col-span-1"
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        type: 'spring',
                        bounce: 0.18,
                        duration: 0.38,
                      },
                    },
                  }}
                >
                  {renderCard(item)}
                </motion.li>
              ))}
            </motion.ul>
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
