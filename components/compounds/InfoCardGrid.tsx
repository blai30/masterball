'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import Fuse from 'fuse.js'
import { useDebouncedCallback } from 'use-debounce'
import CardGrid from '@/components/compounds/CardGrid'
import InfoCard, { type InfoCardProps } from '@/components/compounds/InfoCard'
import SearchBar from '@/components/shared/SearchBar'

const DEFAULT_PAGE = 1
const ITEMS_PER_PAGE = 48

export default function InfoCardGrid({
  data,
  itemsPerPage = ITEMS_PER_PAGE,
  className,
}: {
  data: InfoCardProps[]
  itemsPerPage?: number
  className?: string
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(() => searchParams.get('q') ?? '')
  const [currentPage, setCurrentPage] = useState(
    () => Number(searchParams.get('p')) || DEFAULT_PAGE
  )

  // Debounced URL sync (UI is source of truth)
  const syncUrlParams = useDebouncedCallback((query: string, page: number) => {
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (page !== DEFAULT_PAGE) params.set('p', String(page))
    router.replace(params.toString() ? `?${params}` : '?', { scroll: false })
  }, 500)

  // Sync all state to URL on change
  useEffect(() => {
    syncUrlParams(search, currentPage)
  }, [search, currentPage, syncUrlParams])

  // Handlers
  const handleSearchChange = useCallback((value: string) => {
    setSearch(value)
    setCurrentPage(DEFAULT_PAGE)
  }, [])
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  /**
   * Returns filtered data for grid display.
   */
  const filteredData = useMemo(() => {
    if (!search) return data
    const fuse = new Fuse(data, {
      keys: ['name'],
      threshold: 0.4,
      ignoreLocation: true,
    })
    return fuse.search(search).map((r: { item: InfoCardProps }) => r.item)
  }, [data, search])

  return (
    <div className="flex flex-col gap-8">
      <SearchBar value={search} onChangeAction={handleSearchChange} />
      <CardGrid
        data={filteredData}
        renderCardAction={(props: InfoCardProps) => <InfoCard props={props} />}
        getKeyAction={(item: InfoCardProps) => item.id}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChangeAction={handlePageChange}
        className={
          className ??
          'grid w-full grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        }
      />
    </div>
  )
}
