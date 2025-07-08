'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
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
  const [sortKey, setSortKey] = useState('id')
  const [sortDirection, setSortDirection] = useState(SortDirection.ASC)
  const [typeFilter, setTypeFilter] = useState<string[]>([])
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

  const sortOptions: SortOption<string>[] = [
    { label: 'Dex Id', value: 'id' },
    { label: 'Name', value: 'name' },
  ]

  const options: FilterOption[] = Object.entries(TypeKey).map(
    ([key, value]) => {
      return {
        label: key,
        value: value,
      }
    }
  )

  const filters: FilterConfig[] = [
    {
      label: 'Type',
      options,
      values: typeFilter,
      onChange: setTypeFilter,
    },
  ]

  const filteredData = useMemo(() => {
    let filtered = data.filter(
      (monster) =>
        typeFilter.length === 0 ||
        typeFilter.every((t) =>
          monster.types.includes(t as (typeof monster.types)[number])
        )
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
        // Default to order by id
        return a.id < b.id ? -1 : 1
      })
    }

    return filtered
  }, [data, typeFilter, search, sortKey, sortDirection])

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center justify-between gap-6 lg:flex-row lg:items-end">
        <SearchBar
          value={search}
          onChangeAction={handleSearchChange}
          placeholder="Search..."
        />
        <div className="flex flex-row gap-4">
          <FilterBar filters={filters} />
          <SortBar
            sortKey={sortKey}
            sortDirection={sortDirection}
            sortKeys={sortOptions}
            onSortKeyChangeAction={setSortKey}
            onSortDirectionChangeAction={setSortDirection}
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
