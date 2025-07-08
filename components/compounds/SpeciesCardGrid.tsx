'use client'

import { useMemo, useState } from 'react'
import CardGrid from '@/components/compounds/CardGrid'
import SearchBar from '@/components/shared/SearchBar'
import SortBar, {
  SortDirection,
  type SortOption,
} from '@/components/shared/SortBar'
import MonsterCard, {
  type MonsterCardProps,
} from '@/components/compounds/MonsterCard'
import Fuse from 'fuse.js'

export default function SpeciesCardGrid({
  data,
}: {
  data: MonsterCardProps[]
}) {
  const [search, setSearch] = useState('')

  // Sorting state
  const sortKeyOptions: SortOption<string>[] = [
    { label: 'Dex Id', value: 'id' },
    { label: 'Name', value: 'name' },
  ]
  const [sortKey, setSortKey] = useState('id')
  const [sortDirection, setSortDirection] = useState(SortDirection.ASC)

  const filteredData = useMemo(() => {
    if (!search) return data

    const fuse = new Fuse<MonsterCardProps>(data, {
      keys: ['id', 'name'],
      threshold: 0.4,
      ignoreLocation: true,
    })
    const results = fuse.search(search)
    return results.map((r) => r.item)
  }, [data, search])

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center justify-between gap-6 lg:flex-row lg:items-end">
        <SearchBar
          value={search}
          onChangeAction={setSearch}
          placeholder="Search..."
        />
        <div className="flex flex-row gap-4">
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
        renderCardAction={(data) => <MonsterCard props={data} />}
        getKeyAction={(item) => item.id}
        className="2xs:grid-cols-3 xs:grid-cols-3 grid w-full grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10"
      />
    </div>
  )
}
