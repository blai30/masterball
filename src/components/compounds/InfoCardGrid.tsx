import Fuse from 'fuse.js'
import { useCallback, useMemo, useState } from 'react'

import CardGrid from '@/components/compounds/CardGrid'
import InfoCard, { type InfoCardProps } from '@/components/compounds/InfoCard'
import SearchBar from '@/components/shared/SearchBar'
import { useUrlSync } from '@/lib/hooks/useUrlSync'
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

  // Sync all state to URL on change
  useUrlSync(
    () => ({ search, currentPage }),
    {
      search: { key: 'q', defaultValue: '' },
      currentPage: { key: 'p', defaultValue: DEFAULT_PAGE },
    },
    [search, currentPage]
  )

  // Handlers
  const handleSearchChange = useCallback((value: string) => {
    setSearch(value)
    setCurrentPage(DEFAULT_PAGE)
  }, [])
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const fuse = useMemo(
    () =>
      new Fuse(data, {
        keys: ['name'],
        threshold: 0.4,
      }),
    [data]
  )

  /**
   * Returns filtered data for grid display.
   */
  const filteredData = useMemo(() => {
    // Search first (Fuse is stable across filter changes)
    let results = search ? fuse.search(search).map((result) => result.item) : data

    if (filterByVersionGroup) {
      results = results.filter((resource) =>
        resource.flavorTextEntries.some((entry) => entry.version_group?.name === versionGroup)
      )
    }

    return results
  }, [data, fuse, filterByVersionGroup, search, versionGroup])

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
