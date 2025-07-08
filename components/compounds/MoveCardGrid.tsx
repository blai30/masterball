'use client'

import { useState, useMemo } from 'react'
import CardGrid from '@/components/compounds/CardGrid'
import MoveCard, { type MoveCardProps } from '@/components/compounds/MoveCard'
import FilterBar, { type FilterConfig } from '@/components/shared/FilterBar'
import SearchBar from '@/components/shared/SearchBar'
import SortBar from '@/components/shared/SortBar'

export default function MoveCardGrid({
  data,
  itemsPerPage = 48,
  className,
}: {
  data: MoveCardProps[]
  itemsPerPage?: number
  className?: string
}) {
  // Extract unique types and damage classes from data
  const types = useMemo(
    () => Array.from(new Set(data.map((m) => m.type))).sort(),
    [data]
  )
  const damageClasses = useMemo(
    () => Array.from(new Set(data.map((m) => m.damageClass))).sort(),
    [data]
  )

  // Multi-select state for filters
  const [typeFilter, setTypeFilter] = useState<string[]>([])
  const [damageClassFilter, setDamageClassFilter] = useState<string[]>([])
  const [search, setSearch] = useState('')

  // Sorting state
  const [sortKey, setSortKey] = useState<
    'name' | 'type' | 'damageClass' | 'power' | 'accuracy' | 'pp' | ''
  >('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const filters: FilterConfig[] = [
    {
      label: 'Type',
      options: types.map((type) => ({ label: type, value: type })),
      values: typeFilter,
      onChange: setTypeFilter,
    },
    {
      label: 'Class',
      options: damageClasses.map((dc) => ({ label: dc, value: dc })),
      values: damageClassFilter,
      onChange: setDamageClassFilter,
    },
  ]

  const filteredData = useMemo(() => {
    const filtered = data.filter((move) => {
      const typeMatch =
        typeFilter.length === 0 || typeFilter.includes(move.type)
      const classMatch =
        damageClassFilter.length === 0 ||
        damageClassFilter.includes(move.damageClass)
      const searchMatch =
        !search ||
        move.name.toLowerCase().includes(search.toLowerCase()) ||
        move.slug.toLowerCase().includes(search.toLowerCase())
      return typeMatch && classMatch && searchMatch
    })
    // Sorting logic (same as CardGrid)
    if (sortKey) {
      return [...filtered].sort((a, b) => {
        const aValue = a[sortKey]
        const bValue = b[sortKey]
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
  }, [data, typeFilter, damageClassFilter, search, sortKey, sortDirection])

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between gap-6">
        <SearchBar
          value={search}
          onChangeAction={setSearch}
          placeholder="Search moves..."
        />
        <div className="flex flex-row gap-4">
          <FilterBar filters={filters} />
          <SortBar
            sortKey={sortKey}
            sortDirection={sortDirection}
            sortKeys={[
              'name',
              'type',
              'damageClass',
              'power',
              'accuracy',
              'pp',
            ]}
            onSortKeyChangeAction={setSortKey}
            onSortDirectionChangeAction={setSortDirection}
          />
        </div>
      </div>
      <CardGrid
        data={filteredData}
        renderCardAction={(props) => <MoveCard props={props} />}
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
