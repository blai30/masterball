'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useMemo, useCallback, ReactNode, useEffect } from 'react'
import Fuse from 'fuse.js'
import { Search } from 'lucide-react'
import Pagination from '@/components/compounds/Pagination'

export interface CardGridProps<T> {
  data: T[]
  renderCardAction: (item: T) => ReactNode
  getKeyAction: (item: T) => string | number
  searchKeys: (keyof T)[]
  itemsPerPage?: number
  searchPlaceholder?: string
  className?: string
}

export default function CardGrid<T>({
  data,
  renderCardAction,
  getKeyAction,
  searchKeys,
  itemsPerPage = 60,
  searchPlaceholder = 'Filter...',
  className,
}: CardGridProps<T>) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Read page from URL param 'p', default to 1
  const pageFromUrl = useMemo(() => {
    const p = searchParams.get('p')
    const pageNum = p ? parseInt(p, 10) : 1
    return isNaN(pageNum) || pageNum < 1 ? 1 : pageNum
  }, [searchParams])

  // Read query from URL param 'q', default to ''
  const queryFromUrl = useMemo(() => {
    return searchParams.get('q') || ''
  }, [searchParams])

  const [query, setQuery] = useState(queryFromUrl)
  const [currentPage, setCurrentPage] = useState(pageFromUrl)

  // Keep currentPage in sync with URL param
  useEffect(() => {
    if (currentPage !== pageFromUrl) {
      setCurrentPage(pageFromUrl)
    }
  }, [pageFromUrl, currentPage])

  // Keep query in sync with URL param
  useEffect(() => {
    if (query !== queryFromUrl) {
      setQuery(queryFromUrl)
    }
  }, [queryFromUrl, query])

  const fuse = useMemo(
    () =>
      new Fuse(data, {
        keys: searchKeys as string[],
        threshold: 0.4,
      }),
    [data, searchKeys]
  )

  const filteredItems = useMemo(() => {
    return query ? fuse.search(query).map((result) => result.item) : data
  }, [query, fuse, data])

  const totalPages = useMemo(() => {
    return Math.ceil(filteredItems.length / itemsPerPage)
  }, [filteredItems, itemsPerPage])

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredItems.slice(startIndex, endIndex)
  }, [filteredItems, currentPage, itemsPerPage])

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page)
      // Update URL params 'p' and 'q' (remove if 1 or empty), do not push to history
      const params = new URLSearchParams(Array.from(searchParams.entries()))
      if (page === 1) {
        params.delete('p')
      } else {
        params.set('p', String(page))
      }
      if (!query) {
        params.delete('q')
      } else {
        params.set('q', query)
      }
      const search = params.toString()
      router.replace(search ? `?${search}` : '?', { scroll: false })
    },
    [router, searchParams, query]
  )

  const handleQueryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newQuery = e.target.value
      setQuery(newQuery)
      setCurrentPage(1)
      // Update URL params 'q' and 'p' (remove if empty or 1), do not push to history
      const params = new URLSearchParams(Array.from(searchParams.entries()))
      if (!newQuery) {
        params.delete('q')
      } else {
        params.set('q', newQuery)
      }
      // Always reset page to 1 on search
      params.delete('p')
      const search = params.toString()
      router.replace(search ? `?${search}` : '?', { scroll: false })
    },
    [router, searchParams]
  )

  return (
    <div className="xs:gap-8 flex flex-col gap-4">
      <div className="flex flex-col items-center justify-center p-4">
        <label htmlFor="filter" className="sr-only">
          Filter
        </label>
        <div className="relative flex flex-row items-center text-lg/10">
          <input
            id="filter"
            name="filter"
            type="search"
            placeholder={searchPlaceholder}
            value={query}
            onChange={handleQueryChange}
            className="appearance-none border-b-2 border-zinc-600 bg-transparent pr-10 pl-3 text-zinc-900 outline-hidden transition-colors placeholder:text-zinc-500 focus:border-zinc-900 focus:duration-0 focus:outline-none dark:border-zinc-400 dark:text-zinc-100 dark:focus:border-zinc-100 [&::-webkit-search-decoration]:hidden [&::-webkit-search-results-button]:hidden [&::-webkit-search-results-decoration]:hidden"
          />
          <Search
            size={24}
            className="absolute top-1/2 right-2 h-[1lh] -translate-y-1/2 text-zinc-500 dark:text-zinc-500"
          />
        </div>
      </div>
      <div className="xs:gap-8 flex flex-col gap-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChangeAction={handlePageChange}
        />
        <ul className={className}>
          {paginatedItems.map((item) => (
            <li key={getKeyAction(item)} className="col-span-1">
              {renderCardAction(item)}
            </li>
          ))}
        </ul>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChangeAction={handlePageChange}
        />
      </div>
    </div>
  )
}
