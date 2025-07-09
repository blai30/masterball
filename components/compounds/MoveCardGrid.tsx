'use client'

import { useState, useMemo } from 'react'
import Fuse from 'fuse.js'
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

  // Multi-select state for filters
  const [typeFilter, setTypeFilter] = useState<string[]>([])
  const [damageClassFilter, setDamageClassFilter] = useState<string[]>([])
  const [search, setSearch] = useState('')

  // Memoize Sets for fast lookup
  const typeFilterSet = useMemo(() => new Set(typeFilter), [typeFilter])
  const damageClassFilterSet = useMemo(
    () => new Set(damageClassFilter),
    [damageClassFilter]
  )

  // Sorting state
  const sortKeyOptions: SortOption<string>[] = [
    { label: 'Name', value: 'name' },
    { label: 'Type', value: 'type' },
    { label: 'Class', value: 'damageClass' },
    { label: 'Power', value: 'power' },
    { label: 'Accuracy', value: 'accuracy' },
    { label: 'PP', value: 'pp' },
  ]
  const [sortKey, setSortKey] = useState('name')
  const [sortDirection, setSortDirection] = useState(SortDirection.ASC)

  const filters: FilterConfig[] = useMemo(
    () => [
      {
        label: 'Type',
        options: types,
        values: typeFilter,
        onChange: setTypeFilter,
      },
      {
        label: 'Class',
        options: damageClasses,
        values: damageClassFilter,
        onChange: setDamageClassFilter,
      },
    ],
    [types, damageClasses, typeFilter, damageClassFilter]
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
      const fuse = new Fuse<MoveCardProps>(filtered, {
        keys: ['name'],
        threshold: 0.4,
        ignoreLocation: true,
      })
      filtered = fuse.search(search).map((r) => r.item)
    }

    if (sortKey) {
      return [...filtered].sort((a, b) => {
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
        <SearchBar value={search} onChangeAction={setSearch} />
        <div className="flex w-full flex-col items-center justify-center gap-4 sm:flex-row lg:w-fit">
          <FilterBar filters={filters} />
          <SortBar
            sortKey={sortKey}
            sortDirection={sortDirection}
            sortKeys={sortKeyOptions}
            onSortKeyChangeAction={setSortKey}
            onSortDirectionChangeAction={setSortDirection}
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
