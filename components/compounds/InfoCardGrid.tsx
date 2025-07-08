'use client'

import { useState, useMemo } from 'react'
import CardGrid from '@/components/compounds/CardGrid'
import InfoCard, { type InfoCardProps } from '@/components/compounds/InfoCard'
import SearchBar from '@/components/shared/SearchBar'
import SortBar from '@/components/shared/SortBar'

export default function InfoCardGrid({
  data,
  itemsPerPage = 48,
  className,
}: {
  data: InfoCardProps[]
  itemsPerPage?: number
  className?: string
}) {
  const [search, setSearch] = useState('')

  // Sorting state
  const [sortKey, setSortKey] = useState<'name' | ''>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const filteredData = useMemo(() => {
    const filtered = data.filter((item) => {
      const matchesSearch =
        !search ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.slug.toLowerCase().includes(search.toLowerCase())
      return matchesSearch
    })
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
  }, [data, search, sortKey, sortDirection])

  return (
    <div className="flex flex-col gap-4">
      <SearchBar
        value={search}
        onChangeAction={setSearch}
        placeholder="Search..."
      />
      <SortBar
        sortKey={sortKey}
        sortDirection={sortDirection}
        sortKeys={['name']}
        onSortKeyChangeAction={setSortKey}
        onSortDirectionChangeAction={setSortDirection}
      />
      <CardGrid
        data={filteredData}
        renderCardAction={(props) => <InfoCard props={props} />}
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
