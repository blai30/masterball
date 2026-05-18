import Fuse from 'fuse.js'
import { useState, useMemo } from 'react'

import CardGrid from '@/components/compounds/CardGrid'
import MonsterCard, { type MonsterCardProps } from '@/components/compounds/MonsterCard'
import FilterBar, { type FilterOption, type FilterConfig } from '@/components/shared/FilterBar'
import SearchBar from '@/components/shared/SearchBar'
import SortBar, { SortDirection, type SortOption } from '@/components/shared/SortBar'
import { useUrlSync } from '@/lib/hooks/useUrlSync'
import { TypeKey } from '@/lib/utils/pokeapi-helpers'

const DEFAULT_SORT_KEY = 'id'
const DEFAULT_SORT_DIRECTION = SortDirection.ASC
const DEFAULT_PAGE = 1
const ITEMS_PER_PAGE = 60

const sortOptions: SortOption<string>[] = [
  { label: 'Dex No.', value: 'id' },
  { label: 'Name', value: 'name' },
]
const typeFilters: FilterOption[] = Object.entries(TypeKey).map(([key, value]) => ({
  label: key,
  value,
}))

export default function SpeciesCardGrid({ data }: { data: MonsterCardProps[] }) {
  const [search, setSearch] = useState<string>(() => {
    if (typeof window === 'undefined') return ''
    return new URLSearchParams(window.location.search).get('q') ?? ''
  })
  const [sortKey, setSortKey] = useState<string>(() => {
    if (typeof window === 'undefined') return DEFAULT_SORT_KEY
    return new URLSearchParams(window.location.search).get('sort') ?? DEFAULT_SORT_KEY
  })
  const [sortDirection, setSortDirection] = useState<SortDirection>(() => {
    if (typeof window === 'undefined') return DEFAULT_SORT_DIRECTION
    return (
      (new URLSearchParams(window.location.search).get('dir') as SortDirection) ??
      DEFAULT_SORT_DIRECTION
    )
  })
  const [typeFilter, setTypeFilter] = useState<string[]>(() => {
    if (typeof window === 'undefined') return []
    return new URLSearchParams(window.location.search).get('type')?.split(',').filter(Boolean) ?? []
  })
  const [currentPage, setCurrentPage] = useState<number>(() => {
    if (typeof window === 'undefined') return DEFAULT_PAGE
    return Number(new URLSearchParams(window.location.search).get('p')) || DEFAULT_PAGE
  })

  // Sync all state to URL on change
  useUrlSync(
    () => ({ search, sortKey, sortDirection, typeFilter, currentPage }),
    {
      search: { key: 'q', defaultValue: '' },
      sortKey: { key: 'sort', defaultValue: DEFAULT_SORT_KEY },
      sortDirection: { key: 'dir', defaultValue: DEFAULT_SORT_DIRECTION },
      typeFilter: { key: 'type', defaultValue: [] },
      currentPage: { key: 'p', defaultValue: DEFAULT_PAGE },
    },
    [search, sortKey, sortDirection, typeFilter, currentPage]
  )

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setCurrentPage(DEFAULT_PAGE)
  }
  const handleSortKeyChange = (key: string) => {
    setSortKey(key)
    setCurrentPage(DEFAULT_PAGE)
  }
  const handleSortDirectionChange = (dir: SortDirection) => {
    setSortDirection(dir)
    setCurrentPage(DEFAULT_PAGE)
  }
  const handleTypeFilterChange = (values: string | string[]) => {
    const nextValues = Array.isArray(values) ? values : [values]
    setTypeFilter(nextValues)
    setCurrentPage(DEFAULT_PAGE)
  }
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const filters: FilterConfig[] = [
    {
      label: 'Type',
      options: typeFilters,
      values: typeFilter,
      onChange: handleTypeFilterChange,
    },
  ]

  const fuse = useMemo(
    () =>
      new Fuse(data, {
        keys: ['id', 'name'],
        threshold: 0.4,
        ignoreLocation: false,
      }),
    [data]
  )

  /**
   * Returns filtered and sorted data for grid display.
   */
  const filteredData = useMemo(() => {
    // Search first (Fuse is stable across filter changes)
    let results = search ? fuse.search(search).map((r: { item: MonsterCardProps }) => r.item) : data

    // Apply type filter
    results = results.filter((monster) =>
      typeFilter.every((t) => monster.types.includes(t as TypeKey))
    )

    if (sortKey) {
      results = [...results].sort((a, b) => {
        const aValue = a[sortKey as keyof MonsterCardProps]
        const bValue = b[sortKey as keyof MonsterCardProps]
        if (aValue == null && bValue == null) return 0
        if (aValue == null) return 1
        if (bValue == null) return -1
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
        return a.id < b.id ? -1 : 1
      })
    }

    return results
  }, [data, fuse, typeFilter, search, sortKey, sortDirection])

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-4 lg:flex-row">
        <SearchBar value={search} onChangeAction={handleSearchChange} />
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <FilterBar filters={filters} />
          <SortBar
            sortKey={sortKey}
            sortDirection={sortDirection}
            sortKeys={sortOptions}
            onSortKeyChangeAction={handleSortKeyChange}
            onSortDirectionChangeAction={handleSortDirectionChange}
          />
        </div>
      </div>
      <CardGrid
        data={filteredData}
        renderCardAction={(data) => <MonsterCard props={data} />}
        getKeyAction={(item) => `${item.slug}-${item.id}`}
        currentPage={currentPage}
        onPageChangeAction={handlePageChange}
        itemsPerPage={ITEMS_PER_PAGE}
        className="2xs:grid-cols-3 xs:grid-cols-4 grid w-full grid-cols-2 gap-2 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 2xl:grid-cols-10"
      />
    </div>
  )
}
