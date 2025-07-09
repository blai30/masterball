'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useMemo, useCallback, ReactNode } from 'react'
import Pagination from '@/components/compounds/Pagination'

type CardGridProps<T> = {
  data: T[]
  renderCardAction: (item: T) => ReactNode
  getKeyAction: (item: T) => string | number
  itemsPerPage?: number
  className?: string
}

export default function CardGrid<T>({
  data,
  renderCardAction,
  getKeyAction,
  itemsPerPage = 60,
  className,
}: CardGridProps<T>) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Read page from URL param 'p', default to 1
  const pageFromUrl = useMemo(() => {
    const p = searchParams.get('p')
    const page = p ? parseInt(p, 10) : 1
    return isNaN(page) || page < 1 ? 1 : page
  }, [searchParams])

  // Remove local state, derive from URL only
  const currentPage = pageFromUrl

  // No sorting logic here; data is already sorted/filtered by parent
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return data.slice(startIndex, endIndex)
  }, [data, currentPage, itemsPerPage])

  const totalPages = useMemo(() => {
    return Math.ceil(data.length / itemsPerPage)
  }, [data, itemsPerPage])

  // Remove 'p' param if default (1)
  const handlePageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(Array.from(searchParams.entries()))
      if (page === 1) {
        params.delete('p')
      } else {
        params.set('p', String(page))
      }
      const search = params.toString()
      router.replace(search ? `?${search}` : '?', { scroll: false })
    },
    [router, searchParams]
  )

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
              onPageChangeAction={handlePageChange}
            />
            <ul className={className}>
              {paginatedItems.map((item) => (
                <li key={getKey(item)} className="col-span-1">
                  {renderCard(item)}
                </li>
              ))}
            </ul>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChangeAction={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  )
}
