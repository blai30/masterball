'use client'

import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import { TypeKey } from '@/lib/utils/pokeapiHelpers'
import CardGrid from '@/components/compounds/CardGrid'
import SearchBar from '@/components/shared/SearchBar'
import SortBar, {
  SortDirection,
  type SortOption,
} from '@/components/shared/SortBar'
import MonsterCard, {
  type MonsterCardProps,
} from '@/components/compounds/MonsterCard'
import FilterBar, {
  type FilterOption,
  type FilterConfig,
} from '@/components/shared/FilterBar'
import Fuse from 'fuse.js'

const DEFAULT_SORT_KEY = 'id'
const DEFAULT_SORT_DIRECTION = SortDirection.ASC
const DEFAULT_PAGE = 1
const ITEMS_PER_PAGE = 60

function getInitialState(searchParams: URLSearchParams) {
  return {
    search: searchParams.get('q') ?? '',
    sortKey: searchParams.get('sort') ?? DEFAULT_SORT_KEY,
    sortDirection:
      (searchParams.get('dir') as SortDirection) ?? DEFAULT_SORT_DIRECTION,
    typeFilter: searchParams.get('type')?.split(',').filter(Boolean) ?? [],
    currentPage: Number(searchParams.get('p')) || DEFAULT_PAGE,
  }
}

export default function SpeciesCardGrid({
  data,
}: {
  data: MonsterCardProps[]
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialized = useRef(false)

  // Local state for all controls
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState(DEFAULT_SORT_KEY)
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    DEFAULT_SORT_DIRECTION
  )
  const [typeFilter, setTypeFilter] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE)

  // On first mount, initialize from URL params
  useEffect(() => {
    if (!initialized.current) {
      const initial = getInitialState(searchParams)
      setSearch(initial.search)
      setSortKey(initial.sortKey)
      setSortDirection(initial.sortDirection)
      setTypeFilter(initial.typeFilter)
      setCurrentPage(initial.currentPage)
      initialized.current = true
    }
  }, [searchParams])

  // Debounced URL sync
  const syncUrl = useDebouncedCallback((state) => {
    const params = new URLSearchParams()
    if (state.search) params.set('q', state.search)
    if (state.sortKey !== DEFAULT_SORT_KEY) params.set('sort', state.sortKey)
    if (state.sortDirection !== DEFAULT_SORT_DIRECTION)
      params.set('dir', state.sortDirection)
    if (state.typeFilter.length > 0)
      params.set('type', state.typeFilter.join(','))
    if (state.currentPage !== DEFAULT_PAGE)
      params.set('p', String(state.currentPage))
    router.replace(params.toString() ? `?${params}` : '?', { scroll: false })
  }, 400)

  // Sync all state to URL on change
  useEffect(() => {
    if (!initialized.current) return
    syncUrl({ search, sortKey, sortDirection, typeFilter, currentPage })
  }, [search, sortKey, sortDirection, typeFilter, currentPage, syncUrl])

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

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const sortOptions: SortOption<string>[] = [
    { label: 'Dex Id', value: 'id' },
    { label: 'Name', value: 'name' },
  ]

  const options: FilterOption[] = useMemo(
    () =>
      Object.entries(TypeKey).map(([key, value]) => ({ label: key, value })),
    []
  )

  const filters: FilterConfig[] = useMemo(
    () => [
      {
        label: 'Type',
        options,
        values: typeFilter,
        onChange: handleTypeFilterChange,
      },
    ],
    [typeFilter, options, handleTypeFilterChange]
  )

  const filteredData = useMemo(() => {
    let filtered = data.filter(
      (monster) =>
        typeFilter.length === 0 ||
        typeFilter.every((t) => monster.types.includes(t as TypeKey))
    )

    if (search) {
      const fuse = new Fuse(filtered, {
        keys: ['id', 'name'],
        threshold: 0.4,
        ignoreLocation: true,
      })
      filtered = fuse
        .search(search)
        .map((r: { item: MonsterCardProps }) => r.item)
    }

    if (sortKey) {
      filtered = [...filtered].sort((a, b) => {
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

    return filtered
  }, [data, typeFilter, search, sortKey, sortDirection])

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center justify-between gap-6 lg:flex-row lg:items-end">
        <SearchBar value={search} onChangeAction={handleSearchChange} />
        <div className="flex w-full flex-col items-center justify-center gap-4 sm:flex-row lg:w-fit">
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
        getKeyAction={(item) => item.id}
        currentPage={currentPage}
        onPageChangeAction={handlePageChange}
        itemsPerPage={ITEMS_PER_PAGE}
        className="2xs:grid-cols-3 xs:grid-cols-3 grid w-full grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10"
      />
    </div>
  )
}
