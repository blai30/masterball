'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import Fuse from 'fuse.js'
import { useRouter, useSearchParams } from 'next/navigation'
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

  // Read search from URL param 'q', default to ''
  const searchFromUrl = useMemo(() => {
    const q = searchParams.get('q')
    return q ?? ''
  }, [searchParams])

  const [search, setSearch] = useState(searchFromUrl)

  // Keep search in sync with URL param
  useEffect(() => {
    if (search !== searchFromUrl) {
      setSearch(searchFromUrl)
    }
  }, [searchFromUrl, search])

  // Update URL param 'q' on search change
  const handleSearchChange = useCallback(
    (value: string) => {
      setSearch(value)
      const params = new URLSearchParams(Array.from(searchParams.entries()))
      if (!value) {
        params.delete('q')
      } else {
        params.set('q', value)
      }
      const searchStr = params.toString()
      router.replace(searchStr ? `?${searchStr}` : '?', { scroll: false })
    },
    [router, searchParams]
  )

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
    let filtered = data.filter((move) => {
      const typeMatch =
        typeFilter.length === 0 || typeFilter.includes(move.type)
      const classMatch =
        damageClassFilter.length === 0 ||
        damageClassFilter.includes(move.damageClass)
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
        // Use a type-safe lookup for MoveCardProps
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
  }, [data, typeFilter, damageClassFilter, search, sortKey, sortDirection])

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center justify-between gap-6 lg:flex-row lg:items-end">
        <SearchBar
          value={search}
          onChangeAction={handleSearchChange}
          placeholder="Search moves..."
        />
        <div className="flex flex-row gap-4">
          <FilterBar filters={filters} />
          <SortBar
            sortKey={sortKey}
            sortDirection={sortDirection}
            sortKeys={[...sortKeyOptions]}
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
