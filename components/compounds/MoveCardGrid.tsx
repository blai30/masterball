'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import Fuse from 'fuse.js'
import { useDebouncedCallback } from 'use-debounce'
import { DamageClassKey, TypeKey } from '@/lib/utils/pokeapiHelpers'
import CardGrid from '@/components/compounds/CardGrid'
import MoveCard, { type MoveCardProps } from '@/components/compounds/MoveCard'
import FilterBar, { type FilterConfig } from '@/components/shared/FilterBar'
import SearchBar from '@/components/shared/SearchBar'
import SortBar, {
  SortDirection,
  type SortOption,
} from '@/components/shared/SortBar'

const DEFAULT_SORT_KEY = 'name'
const DEFAULT_SORT_DIRECTION = SortDirection.ASC
const DEFAULT_PAGE = 1
const ITEMS_PER_PAGE = 36

function getInitialState(searchParams: URLSearchParams) {
  return {
    search: searchParams.get('q') ?? '',
    sortKey: searchParams.get('sort') ?? DEFAULT_SORT_KEY,
    sortDirection:
      (searchParams.get('dir') as SortDirection) ?? DEFAULT_SORT_DIRECTION,
    typeFilter: searchParams.get('type')?.split(',').filter(Boolean) ?? [],
    damageClassFilter:
      searchParams.get('class')?.split(',').filter(Boolean) ?? [],
    currentPage: Number(searchParams.get('p')) || DEFAULT_PAGE,
  }
}

export default function MoveCardGrid({
  data,
  itemsPerPage = ITEMS_PER_PAGE,
  className,
}: {
  data: MoveCardProps[]
  itemsPerPage?: number
  className?: string
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
  const [damageClassFilter, setDamageClassFilter] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE)

  // On first mount, initialize from URL params
  useEffect(() => {
    if (!initialized.current) {
      const initial = getInitialState(searchParams)
      setSearch(initial.search)
      setSortKey(initial.sortKey)
      setSortDirection(initial.sortDirection)
      setTypeFilter(initial.typeFilter)
      setDamageClassFilter(initial.damageClassFilter)
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
    if (state.damageClassFilter.length > 0)
      params.set('class', state.damageClassFilter.join(','))
    if (state.currentPage !== DEFAULT_PAGE)
      params.set('p', String(state.currentPage))
    router.replace(params.toString() ? `?${params}` : '?', { scroll: false })
  }, 400)

  // Sync all state to URL on change
  useEffect(() => {
    if (!initialized.current) return
    syncUrl({
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
    syncUrl,
  ])

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

  const types = useMemo(
    () =>
      Object.entries(TypeKey).map(([key, value]) => ({ label: key, value })),
    []
  )

  const damageClasses = useMemo(
    () =>
      Object.entries(DamageClassKey).map(([key, value]) => ({
        label: key,
        value,
      })),
    []
  )

  const sortKeyOptions: SortOption<string>[] = [
    { label: 'Name', value: 'name' },
    { label: 'Type', value: 'type' },
    { label: 'Class', value: 'damageClass' },
    { label: 'Power', value: 'power' },
    { label: 'Accuracy', value: 'accuracy' },
    { label: 'PP', value: 'pp' },
  ]

  const filters: FilterConfig[] = useMemo(
    () => [
      {
        label: 'Type',
        options: types,
        values: typeFilter,
        onChange: handleTypeFilterChange,
      },
      {
        label: 'Class',
        options: damageClasses,
        values: damageClassFilter,
        onChange: handleDamageClassFilterChange,
      },
    ],
    [
      types,
      damageClasses,
      typeFilter,
      damageClassFilter,
      handleTypeFilterChange,
      handleDamageClassFilterChange,
    ]
  )

  const typeFilterSet = useMemo(() => new Set(typeFilter), [typeFilter])
  const damageClassFilterSet = useMemo(
    () => new Set(damageClassFilter),
    [damageClassFilter]
  )

  const filteredData = useMemo(() => {
    let filtered = data.filter((move) => {
      const typeMatch = typeFilterSet.size === 0 || typeFilterSet.has(move.type)
      const classMatch =
        damageClassFilterSet.size === 0 ||
        damageClassFilterSet.has(move.damageClass)
      return typeMatch && classMatch
    })

    if (search) {
      const fuse = new Fuse(filtered, {
        keys: ['name'],
        threshold: 0.4,
        ignoreLocation: true,
      })
      filtered = fuse.search(search).map((r: { item: MoveCardProps }) => r.item)
    }

    if (sortKey) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sortKey as keyof MoveCardProps]
        const bValue = b[sortKey as keyof MoveCardProps]
        if (aValue == null && bValue == null) return 0
        if (aValue == null) return 1
        if (bValue == null) return -1
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
        // Fallback: if both have a 'name' property, use it as tiebreaker
        const aObj = a as { name?: string }
        const bObj = b as { name?: string }
        if (aObj.name && bObj.name) {
          if (aObj.name < bObj.name) return sortDirection === 'asc' ? -1 : 1
          if (aObj.name > bObj.name) return sortDirection === 'asc' ? 1 : -1
        }
        return 0
      })
    }

    return filtered
  }, [
    data,
    typeFilterSet,
    damageClassFilterSet,
    search,
    sortKey,
    sortDirection,
  ])

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center justify-between gap-6 lg:flex-row lg:items-end">
        <SearchBar value={search} onChangeAction={handleSearchChange} />
        <div className="flex w-full flex-col items-center justify-center gap-4 sm:flex-row lg:w-fit">
          <FilterBar filters={filters} />
          <SortBar
            sortKey={sortKey}
            sortDirection={sortDirection}
            sortKeys={sortKeyOptions}
            onSortKeyChangeAction={handleSortKeyChange}
            onSortDirectionChangeAction={handleSortDirectionChange}
          />
        </div>
      </div>
      <CardGrid
        data={filteredData}
        renderCardAction={(props: MoveCardProps) => <MoveCard props={props} />}
        getKeyAction={(item) => item.id}
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
