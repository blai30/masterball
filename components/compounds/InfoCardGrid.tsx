'use client'

import { useState, useMemo } from 'react'
import Fuse from 'fuse.js'
import CardGrid from '@/components/compounds/CardGrid'
import InfoCard, { type InfoCardProps } from '@/components/compounds/InfoCard'
import SearchBar from '@/components/shared/SearchBar'

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

  const filteredData = useMemo(() => {
    if (!search) return data
    const fuse = new Fuse<InfoCardProps>(data, {
      keys: ['name'],
      threshold: 0.4,
      ignoreLocation: true,
    })
    const results = fuse.search(search)
    return results.map((r) => r.item)
  }, [data, search])

  return (
    <div className="flex flex-col gap-8">
      <SearchBar
        value={search}
        onChangeAction={setSearch}
        placeholder="Search..."
      />
      <CardGrid
        data={filteredData}
        renderCardAction={(props: InfoCardProps) => <InfoCard props={props} />}
        getKeyAction={(item: InfoCardProps) => item.id}
        itemsPerPage={itemsPerPage}
        className={
          className ??
          'grid w-full grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        }
      />
    </div>
  )
}
