'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState, useMemo } from 'react'
import Fuse from 'fuse.js'
import { useDebouncedCallback } from 'use-debounce'
import CardGrid from '@/components/compounds/CardGrid'
import InfoCard, { type InfoCardProps } from '@/components/compounds/InfoCard'
import SearchBar from '@/components/shared/SearchBar'

export default function InfoCardGrid({
  data,
  itemsPerPage = 48,
  className,
}: {
  data: InfoCardProps[]
  itemsPerPage?: number
  className?: string
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Only initialize local state from URL params on first mount
  const initialSearch = searchParams.get('q') ?? ''
  const initialPage = parseInt(searchParams.get('p') ?? '1', 10) || 1
  const [search, setSearch] = useState(initialSearch)
  const [currentPage, setCurrentPage] = useState(initialPage)

  // Debounced URL sync (UI is source of truth)
  const updateUrlParams = useDebouncedCallback(
    (searchValue: string, pageValue: number) => {
      const params = new URLSearchParams(Array.from(searchParams.entries()))
      if (!searchValue) {
        params.delete('q')
      } else {
        params.set('q', searchValue)
      }
      if (pageValue === 1) {
        params.delete('p')
      } else {
        params.set('p', String(pageValue))
      }
      router.replace(params.toString() ? `?${params}` : '?', { scroll: false })
    },
    300
  )

  // Handler updates local state, debounced URL
  const handleSearchChange = useCallback(
    (value: string) => {
      setSearch(value)
      setCurrentPage(1)
      updateUrlParams(value, 1)
    },
    [updateUrlParams]
  )

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page)
      updateUrlParams(search, page)
    },
    [updateUrlParams, search]
  )

  const filteredData = useMemo(() => {
    if (!search) return data
    const fuse = new Fuse<InfoCardProps>(data, {
      keys: ['name'],
      threshold: 0.4,
      ignoreLocation: true,
    })
    const results = fuse.search(search)
    return results.map((r) => r.item)
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
