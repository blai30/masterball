'use client'

import { useMemo, useCallback } from 'react'
import Fuse from 'fuse.js'
import { useRouter, useSearchParams } from 'next/navigation'
import { DamageClassKey, TypeKey } from '@/lib/utils/pokeapiHelpers'
import CardGrid from '@/components/compounds/CardGrid'
import MoveCard, { type MoveCardProps } from '@/components/compounds/MoveCard'
import FilterBar, { type FilterConfig } from '@/components/shared/FilterBar'
import SearchBar from '@/components/shared/SearchBar'
import SortBar, {
  SortDirection,
  type SortOption,
} from '@/components/shared/SortBar'

export default function MoveCardGrid({
  data,
  itemsPerPage = 48,
  className,
}: {
  data: MoveCardProps[]
  itemsPerPage?: number
  className?: string
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Derive search, sort, and filter state from URL params
  const search = useMemo(() => searchParams.get('q') ?? '', [searchParams])
  const sortKey = useMemo(() => searchParams.get('sort') ?? 'name', [searchParams])
  const sortDirection = useMemo(
    () => (searchParams.get('dir') as SortDirection) ?? SortDirection.ASC,
    [searchParams]
  )
  // Use comma-separated single param for type and class filters
  const typeFilter = useMemo(() => {
    const val = searchParams.get('type')
    return val ? val.split(',').filter(Boolean) : []
  }, [searchParams])
  const damageClassFilter = useMemo(() => {
    const val = searchParams.get('class')
    return val ? val.split(',').filter(Boolean) : []
  }, [searchParams])

  // Handler updates URL only, and resets pagination
  const handleSearchChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(Array.from(searchParams.entries()))
      if (!value) {
        params.delete('q')
      } else {
        params.set('q', value)
      }
      // Reset pagination
      params.delete('p')
      router.replace(params.toString() ? `?${params}` : '?', { scroll: false })
    },
    [router, searchParams]
  )

  const handleSortKeyChange = useCallback(
    (key: string) => {
      const params = new URLSearchParams(Array.from(searchParams.entries()))
      if (key === 'name') {
        params.delete('sort')
      } else {
        params.set('sort', key)
      }
      // Reset pagination
      params.delete('p')
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
      // Reset pagination
      params.delete('p')
      router.replace(params.toString() ? `?${params}` : '?', { scroll: false })
    },
    [router, searchParams]
  )

  const handleTypeFilterChange = useCallback(
    (values: string[]) => {
      const params = new URLSearchParams(Array.from(searchParams.entries()))
      if (values.length === 0) {
        params.delete('type')
      } else {
        params.set('type', values.join(','))
      }
      // Reset pagination
      params.delete('p')
      router.replace(params.toString() ? `?${params}` : '?', { scroll: false })
    },
    [router, searchParams]
  )

  const handleDamageClassFilterChange = useCallback(
    (values: string[]) => {
      const params = new URLSearchParams(Array.from(searchParams.entries()))
      if (values.length === 0) {
        params.delete('class')
      } else {
        params.set('class', values.join(','))
      }
      // Reset pagination
      params.delete('p')
      router.replace(params.toString() ? `?${params}` : '?', { scroll: false })
    },
    [router, searchParams]
  )

  const types = useMemo(
    () =>
      Object.entries(TypeKey).map(([key, value]) => ({
        label: key,
        value,
      })),
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
    [types, damageClasses, typeFilter, damageClassFilter, handleTypeFilterChange, handleDamageClassFilterChange]
  )

  const typeFilterSet = useMemo(() => new Set(typeFilter), [typeFilter])
  const damageClassFilterSet = useMemo(() => new Set(damageClassFilter), [damageClassFilter])

  const filteredData = useMemo(() => {
    let filtered = data.filter((move) => {
      const typeMatch = typeFilterSet.size === 0 || typeFilterSet.has(move.type)
      const classMatch =
        damageClassFilterSet.size === 0 ||
        damageClassFilterSet.has(move.damageClass)
      return typeMatch && classMatch
    })

    if (search) {
      const fuse = new Fuse<MoveCardProps>(filtered, {
        keys: ['name'],
        threshold: 0.4,
        ignoreLocation: true,
      })
      filtered = fuse.search(search).map((r) => r.item)
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
        const aObj = a as Record<string, unknown>
        const bObj = b as Record<string, unknown>
        if ('name' in aObj && 'name' in bObj) {
          const aName = aObj.name
          const bName = bObj.name
          if (typeof aName === 'string' && typeof bName === 'string') {
            if (aName < bName) return sortDirection === 'asc' ? -1 : 1
            if (aName > bName) return sortDirection === 'asc' ? 1 : -1
          }
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
        itemsPerPage={itemsPerPage}
        className={
          className ??
          'grid w-full grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        }
      />
    </div>
  )
}
