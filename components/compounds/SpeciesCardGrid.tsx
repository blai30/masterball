'use client'

import { useCallback, useMemo } from 'react'
import Fuse from 'fuse.js'
import { useRouter, useSearchParams } from 'next/navigation'
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

export default function SpeciesCardGrid({
  data,
}: {
  data: MonsterCardProps[]
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Derive search, sort, and filter state from URL params
  const search = useMemo(() => searchParams.get('q') ?? '', [searchParams])
  const sortKey = useMemo(() => searchParams.get('sort') ?? 'id', [searchParams])
  const sortDirection = useMemo(
    () => (searchParams.get('dir') as SortDirection) ?? SortDirection.ASC,
    [searchParams]
  )
  // Use comma-separated single param for type filter
  const typeFilter = useMemo(() => {
    const val = searchParams.get('type')
    return val ? val.split(',').filter(Boolean) : []
  }, [searchParams])

  // Handlers update URL only
  const handleSearchChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(Array.from(searchParams.entries()))
      if (!value) {
        params.delete('q')
      } else {
        params.set('q', value)
      }
      router.replace(params.toString() ? `?${params}` : '?', { scroll: false })
    },
    [router, searchParams]
  )

  const handleSortKeyChange = useCallback(
    (key: string) => {
      const params = new URLSearchParams(Array.from(searchParams.entries()))
      if (key === 'id') {
        params.delete('sort')
      } else {
        params.set('sort', key)
      }
      router.replace(params.toString() ? `?${params}` : '?', { scroll: false })
    },
    [router, searchParams]
  )

  const handleSortDirectionChange = useCallback(
    (dir: SortDirection) => {
      const params = new URLSearchParams(Array.from(searchParams.entries()))
      if (dir === SortDirection.ASC) {
        params.delete('dir')
      } else {
        params.set('dir', dir)
      }
      router.replace(params.toString() ? `?${params}` : '?', { scroll: false })
    },
    [router, searchParams]
  )

  // Store as comma-separated single param
  const handleTypeFilterChange = useCallback(
    (values: string[]) => {
      const params = new URLSearchParams(Array.from(searchParams.entries()))
      if (values.length === 0) {
        params.delete('type')
      } else {
        params.set('type', values.join(','))
      }
      router.replace(params.toString() ? `?${params}` : '?', { scroll: false })
    },
    [router, searchParams]
  )

  const sortOptions: SortOption<string>[] = [
    { label: 'Dex Id', value: 'id' },
    { label: 'Name', value: 'name' },
  ]

  const options: FilterOption[] = Object.entries(TypeKey).map(
    ([key, value]) => ({ label: key, value })
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
      const fuse = new Fuse<MonsterCardProps>(filtered, {
        keys: ['id', 'name'],
        threshold: 0.4,
        ignoreLocation: true,
      })
      filtered = fuse.search(search).map((r) => r.item)
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
        className="2xs:grid-cols-3 xs:grid-cols-3 grid w-full grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10"
      />
    </div>
  )
}
