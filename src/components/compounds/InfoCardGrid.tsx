import Fuse from 'fuse.js'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'

import CardGrid from '@/components/compounds/CardGrid'
import InfoCard, { type InfoCardProps } from '@/components/compounds/InfoCard'
import SearchBar from '@/components/shared/SearchBar'
import { useVersionGroup } from '@/lib/stores/version-group'

const DEFAULT_PAGE = 1
const ITEMS_PER_PAGE = 48

export default function InfoCardGrid({
  data,
  filterByVersionGroup = false,
  itemsPerPage = ITEMS_PER_PAGE,
  className,
}: {
  data: InfoCardProps[]
  filterByVersionGroup?: boolean
  itemsPerPage?: number
  className?: string
}) {
  const { versionGroup } = useVersionGroup()

  const [search, setSearch] = useState<string>(() => {
    if (typeof window === 'undefined') return ''
    return new URLSearchParams(window.location.search).get('q') ?? ''
  })
  const [currentPage, setCurrentPage] = useState<number>(() => {
    if (typeof window === 'undefined') return DEFAULT_PAGE
    return Number(new URLSearchParams(window.location.search).get('p')) || DEFAULT_PAGE
  })

  // Debounced URL sync (UI is source of truth)
  const syncUrlParams = useDebouncedCallback((query: string, page: number) => {
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (page !== DEFAULT_PAGE) params.set('p', String(page))
    window.history.replaceState(
      null,
      '',
      params.toString() ? `?${params}` : window.location.pathname
    )
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
    const filtered = filterByVersionGroup
      ? data.filter((resource) =>
          resource.flavorTextEntries.some((entry) => entry.version_group?.name === versionGroup)
        )
      : data

    if (!search) return filtered
    const fuse = new Fuse(filtered, {
      keys: ['name'],
      threshold: 0.4,
    })
    return fuse.search(search).map((result) => result.item)
  }, [data, filterByVersionGroup, search, versionGroup])

  return (
    <div className="flex flex-col gap-8">
      <SearchBar value={search} onChangeAction={handleSearchChange} />
      <CardGrid
        data={filteredData}
        renderCardAction={(props: InfoCardProps) => <InfoCard props={props} />}
        getKeyAction={(item: InfoCardProps) => `${item.slug}-${item.id}`}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChangeAction={handlePageChange}
        className={
          className ?? 'grid w-full grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        }
      />
    </div>
  )
}
