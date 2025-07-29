'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useMemo, useCallback, useEffect } from 'react'
import Fuse from 'fuse.js'
import { useDebouncedCallback } from 'use-debounce'
import { useVersionGroup } from '@/lib/stores/version-group'
import {
  DamageClassKey,
  type MoveInfo,
  TypeKey,
} from '@/lib/utils/pokeapiHelpers'
import CardGrid from '@/components/compounds/CardGrid'
import MoveCard from '@/components/compounds/MoveCard'
import FilterBar, { type FilterConfig } from '@/components/shared/FilterBar'
import SearchBar from '@/components/shared/SearchBar'
import SortBar, {
  SortDirection,
  type SortOption,
} from '@/components/shared/SortBar'
import { type FilterOption } from '@/components/shared/FilterBar'

const DEFAULT_SORT_KEY = 'name'
const DEFAULT_SORT_DIRECTION = SortDirection.ASC
const DEFAULT_PAGE = 1
const ITEMS_PER_PAGE = 36

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
  const router = useRouter()
  const searchParams = useSearchParams()
  const { versionGroup } = useVersionGroup()

  const sortOptions: SortOption<string>[] = useMemo(
    () => [
      { label: 'Name', value: 'name' },
      { label: 'Type', value: 'type' },
      { label: 'Class', value: 'damageClass' },
      { label: 'Power', value: 'power' },
      { label: 'Accuracy', value: 'accuracy' },
      { label: 'PP', value: 'pp' },
    ],
    []
  )
  const typeFilters: FilterOption[] = useMemo(
    () =>
      Object.entries(TypeKey).map(([key, value]) => ({ label: key, value })),
    []
  )
  const damageClassFilters: FilterOption[] = useMemo(
    () =>
      Object.entries(DamageClassKey).map(([key, value]) => ({
        label: key,
        value,
      })),
    []
  )

  const [search, setSearch] = useState(() => searchParams.get('q') ?? '')
  const [sortKey, setSortKey] = useState(
    () => searchParams.get('sort') ?? DEFAULT_SORT_KEY
  )
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    () => (searchParams.get('dir') as SortDirection) ?? DEFAULT_SORT_DIRECTION
  )
  const [typeFilter, setTypeFilter] = useState<string[]>(
    () => searchParams.get('type')?.split(',').filter(Boolean) ?? []
  )
  const [damageClassFilter, setDamageClassFilter] = useState<string[]>(
    () => searchParams.get('class')?.split(',').filter(Boolean) ?? []
  )
  const [currentPage, setCurrentPage] = useState(
    () => Number(searchParams.get('p')) || DEFAULT_PAGE
  )

  // Debounced URL sync
  const syncUrlParams = useDebouncedCallback(
    (state: {
      search: string
      sortKey: string
      sortDirection: SortDirection
      typeFilter: string[]
      damageClassFilter: string[]
      currentPage: number
    }) => {
      const params = new URLSearchParams()
      if (state.search) params.set('q', state.search)
      if (state.sortKey !== DEFAULT_SORT_KEY) params.set('sort', state.sortKey)
      if (state.sortDirection !== DEFAULT_SORT_DIRECTION)
        params.set('dir', state.sortDirection)
      if (state.typeFilter.length > 0)
        params.set('type', state.typeFilter.join(','))
      if (state.damageClassFilter.length > 0)
        params.set('class', state.damageClassFilter.join(','))
      if (state.currentPage !== DEFAULT_PAGE)
        params.set('p', String(state.currentPage))
      router.replace(params.toString() ? `?${params}` : '?', { scroll: false })
    },
    500
  )

  // Sync all state to URL on change
  useEffect(() => {
    syncUrlParams({
      search,
      sortKey,
      sortDirection,
      typeFilter,
      damageClassFilter,
      currentPage,
    })
  }, [
    search,
    sortKey,
    sortDirection,
    typeFilter,
    damageClassFilter,
    currentPage,
    syncUrlParams,
  ])

  // Handlers
  const handleSearchChange = useCallback((value: string) => {
    setSearch(value)
    setCurrentPage(DEFAULT_PAGE)
  }, [])
  const handleSortKeyChange = useCallback((key: string) => {
    setSortKey(key)
    setCurrentPage(DEFAULT_PAGE)
  }, [])
  const handleSortDirectionChange = useCallback((dir: SortDirection) => {
    setSortDirection(dir)
    setCurrentPage(DEFAULT_PAGE)
  }, [])
  const handleTypeFilterChange = useCallback((values: string[]) => {
    setTypeFilter(values)
    setCurrentPage(DEFAULT_PAGE)
  }, [])
  const handleDamageClassFilterChange = useCallback((values: string[]) => {
    setDamageClassFilter(values)
    setCurrentPage(DEFAULT_PAGE)
  }, [])
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const filters: FilterConfig[] = useMemo(
    () => [
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
          handleDamageClassFilterChange(
            Array.isArray(values) ? values : [values]
          ),
      },
    ],
    [
      typeFilter,
      typeFilters,
      handleTypeFilterChange,
      damageClassFilter,
      damageClassFilters,
      handleDamageClassFilterChange,
    ]
  )

  /**
   * Returns filtered and sorted data for grid display.
   */
  const filteredData = useMemo(() => {
    let filtered = data

    if (filterByVersionGroup) {
      filtered = filtered.filter((resource) =>
        resource.flavorTextEntries.some(
          (entry) => entry.version_group?.name === versionGroup
        )
      )
    }

    filtered = filtered.filter((resource) => {
      const typeMatch =
        typeFilter.length === 0 || typeFilter.includes(resource.type)
      const classMatch =
        damageClassFilter.length === 0 ||
        damageClassFilter.includes(resource.damageClass)
      return typeMatch && classMatch
    })

    if (search) {
      const fuse = new Fuse(filtered, {
        keys: ['name'],
        threshold: 0.4,
        ignoreLocation: false,
      })
      filtered = fuse.search(search).map((r: { item: MoveInfo }) => r.item)
    }

    if (sortKey) {
      filtered = [...filtered].sort((a, b) => {
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

    return filtered
  }, [
    data,
    typeFilter,
    damageClassFilter,
    search,
    sortKey,
    sortDirection,
    versionGroup,
    filterByVersionGroup,
  ])

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
          className ??
          'grid w-full grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        }
      />
    </div>
  )
}
