import Fuse from 'fuse.js'
import { useState } from 'react'

import CardGrid from '@/components/compounds/CardGrid'
import MoveCard from '@/components/compounds/MoveCard'
import FilterBar, { type FilterConfig } from '@/components/shared/FilterBar'
import type { FilterOption } from '@/components/shared/FilterBar'
import SearchBar from '@/components/shared/SearchBar'
import SortBar, { SortDirection, type SortOption } from '@/components/shared/SortBar'
import { useUrlSync } from '@/lib/hooks/useUrlSync'
import { useVersionGroup } from '@/lib/stores/version-group'
import { DamageClassKey, type MoveInfo, TypeKey } from '@/lib/utils/pokeapi-helpers'

const DEFAULT_SORT_KEY = 'name'
const DEFAULT_SORT_DIRECTION = SortDirection.ASC
const DEFAULT_PAGE = 1
const ITEMS_PER_PAGE = 36

const sortOptions: SortOption<string>[] = [
  { label: 'Name', value: 'name' },
  { label: 'Type', value: 'type' },
  { label: 'Class', value: 'damageClass' },
  { label: 'Power', value: 'power' },
  { label: 'Accuracy', value: 'accuracy' },
  { label: 'PP', value: 'pp' },
]
const typeFilters: FilterOption[] = Object.entries(TypeKey).map(([key, value]) => ({
  label: key,
  value,
}))
const damageClassFilters: FilterOption[] = Object.entries(DamageClassKey).map(([key, value]) => ({
  label: key,
  value,
}))

export default function MoveCardGrid({
  data,
  filterByVersionGroup = false,
  itemsPerPage = ITEMS_PER_PAGE,
  className,
}: {
  data: MoveInfo[]
  filterByVersionGroup?: boolean
  itemsPerPage?: number
  className?: string
}) {
  const { versionGroup } = useVersionGroup()

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
  const [damageClassFilter, setDamageClassFilter] = useState<string[]>(() => {
    if (typeof window === 'undefined') return []
    return (
      new URLSearchParams(window.location.search).get('class')?.split(',').filter(Boolean) ?? []
    )
  })
  const [currentPage, setCurrentPage] = useState<number>(() => {
    if (typeof window === 'undefined') return DEFAULT_PAGE
    return Number(new URLSearchParams(window.location.search).get('p')) || DEFAULT_PAGE
  })

  // Sync all state to URL on change
  useUrlSync(
    () => ({ search, sortKey, sortDirection, typeFilter, damageClassFilter, currentPage }),
    {
      search: { key: 'q', defaultValue: '' },
      sortKey: { key: 'sort', defaultValue: DEFAULT_SORT_KEY },
      sortDirection: { key: 'dir', defaultValue: DEFAULT_SORT_DIRECTION },
      typeFilter: { key: 'type', defaultValue: [] },
      damageClassFilter: { key: 'class', defaultValue: [] },
      currentPage: { key: 'p', defaultValue: DEFAULT_PAGE },
    },
    [search, sortKey, sortDirection, typeFilter, damageClassFilter, currentPage]
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
  const handleTypeFilterChange = (values: string[]) => {
    setTypeFilter(values)
    setCurrentPage(DEFAULT_PAGE)
  }
  const handleDamageClassFilterChange = (values: string[]) => {
    setDamageClassFilter(values)
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
      onChange: (values: string | string[]) =>
        handleTypeFilterChange(Array.isArray(values) ? values : [values]),
    },
    {
      label: 'Class',
      options: damageClassFilters,
      values: damageClassFilter,
      onChange: (values: string | string[]) =>
        handleDamageClassFilterChange(Array.isArray(values) ? values : [values]),
    },
  ]

  const fuse = new Fuse(data, {
    keys: ['name'],
    threshold: 0.4,
    ignoreLocation: false,
  })

  /**
   * Returns filtered and sorted data for grid display.
   */
  const filteredData = (() => {
    // Search first (Fuse is stable across filter changes)
    let results = search ? fuse.search(search).map((r: { item: MoveInfo }) => r.item) : data

    if (filterByVersionGroup) {
      results = results.filter((resource) =>
        resource.flavorTextEntries.some((entry) => entry.version_group?.name === versionGroup)
      )
    }

    results = results.filter((resource) => {
      const typeMatch = typeFilter.length === 0 || typeFilter.includes(resource.type)
      const classMatch =
        damageClassFilter.length === 0 || damageClassFilter.includes(resource.damageClass)
      return typeMatch && classMatch
    })

    if (sortKey) {
      results = [...results].sort((a, b) => {
        const aValue = a[sortKey as keyof MoveInfo]
        const bValue = b[sortKey as keyof MoveInfo]
        if (aValue == null && bValue == null) return 0
        if (aValue == null) return 1
        if (bValue == null) return -1
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
        // Fallback: if both have a 'name' property, use it as tiebreaker
        if (a.name && b.name) {
          if (a.name < b.name) return sortDirection === 'asc' ? -1 : 1
          if (a.name > b.name) return sortDirection === 'asc' ? 1 : -1
        }
        return 0
      })
    }

    return results
  })()

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
        renderCardAction={(props: MoveInfo) => <MoveCard props={props} />}
        getKeyAction={(item) => `${item.slug}-${item.id}`}
        currentPage={currentPage}
        onPageChangeAction={handlePageChange}
        itemsPerPage={itemsPerPage}
        className={
          className ?? 'grid w-full grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        }
      />
    </div>
  )
}
