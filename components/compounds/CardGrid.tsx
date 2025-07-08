'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useMemo, useCallback, ReactNode, useEffect } from 'react'
import Fuse from 'fuse.js'
import Pagination from '@/components/compounds/Pagination'
import SearchBar from '@/components/shared/SearchBar'

export interface CardGridProps<T> {
  data: T[]
  renderCardAction: (item: T) => ReactNode
  getKeyAction: (item: T) => string | number
  searchKeys: (keyof T)[]
  itemsPerPage?: number
  searchPlaceholder?: string
  className?: string
  initialSortKey?: keyof T
  initialSortDirection?: 'asc' | 'desc'
  sortableKeys?: (keyof T)[]
}

export default function CardGrid<T>({
  data,
  renderCardAction,
  getKeyAction,
  searchKeys,
  itemsPerPage = 60,
  searchPlaceholder,
  className,
  initialSortKey,
  initialSortDirection = 'asc',
  sortableKeys,
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

  // Use sortableKeys if provided, otherwise fallback to all keys from first item
  const dataKeys = useMemo(() => {
    if (sortableKeys && sortableKeys.length > 0) return sortableKeys
    if (data.length === 0) return []
    return Object.keys(data[0] as object) as (keyof T)[]
  }, [sortableKeys, data])

  // Sorting state (controlled by UI, fallback to initial props)
  const [sortKey, setSortKey] = useState<keyof T | undefined>(initialSortKey)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(
    initialSortDirection
  )

  // Keep sort state in sync with initial props if they change
  useEffect(() => {
    setSortKey(initialSortKey)
  }, [initialSortKey])
  useEffect(() => {
    setSortDirection(initialSortDirection)
  }, [initialSortDirection])

  const filteredItems = useMemo(() => {
    const items = query ? fuse.search(query).map((result) => result.item) : data
    if (sortKey) {
      return [...items].sort((a, b) => {
        const aValue = a[sortKey]
        const bValue = b[sortKey]
        if (aValue == null && bValue == null) return 0
        if (aValue == null) return 1
        if (bValue == null) return -1
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
        // Fallback: if both have a 'name' property, use it as tiebreaker
        const aObj = a as Record<string, unknown>
        const bObj = b as Record<string, unknown>
        if ('name' in aObj && 'name' in bObj) {
          const aName = aObj.name
          const bName = bObj.name
          if (typeof aName === 'string' && typeof bName === 'string') {
            if (aName < bName) return sortDirection === 'asc' ? -1 : 1
            if (aName > bName) return sortDirection === 'asc' ? 1 : -1
          }
        }
        return 0
      })
    }
    return items
  }, [query, fuse, data, sortKey, sortDirection])

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

  const handleSearchBarChange = useCallback(
    (value: string) => {
      setQuery(value)
      setCurrentPage(1)
      // Update URL params 'q' and 'p' (remove if empty or 1), do not push to history
      const params = new URLSearchParams(Array.from(searchParams.entries()))
      if (!value) {
        params.delete('q')
      } else {
        params.set('q', value)
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
      <div className="flex flex-col items-center justify-center gap-2 p-4">
        {/* Sorting controls */}
        <div className="flex w-full max-w-md flex-row items-center gap-2">
          <label htmlFor="sortKey" className="sr-only">
            Sort by
          </label>
          <select
            id="sortKey"
            value={(sortKey as string | undefined) || ''}
            onChange={(e) =>
              setSortKey(
                e.target.value ? (e.target.value as keyof T) : undefined
              )
            }
            className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-zinc-900 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          >
            <option value="">Sort by…</option>
            {dataKeys.map((key) => (
              <option key={String(key)} value={String(key)}>
                {String(key)}
              </option>
            ))}
          </select>
          <label htmlFor="sortDirection" className="sr-only">
            Sort direction
          </label>
          <select
            id="sortDirection"
            value={sortDirection}
            onChange={(e) => setSortDirection(e.target.value as 'asc' | 'desc')}
            className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-zinc-900 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          >
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </div>
        {/* Search input */}
        <SearchBar
          value={query}
          onChangeAction={handleSearchBarChange}
          placeholder={searchPlaceholder}
        />
      </div>
      <div className="xs:gap-8 flex flex-col gap-4">
        {filteredItems.length === 0 ? (
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
          </>
        )}
      </div>
    </div>
  )
}
