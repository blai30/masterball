'use client'

import { useMemo, useCallback } from 'react'
import Fuse from 'fuse.js'
import { useRouter, useSearchParams } from 'next/navigation'
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
  const router = useRouter()
  const searchParams = useSearchParams()

  // Derive search from URL param
  const search = useMemo(() => searchParams.get('q') ?? '', [searchParams])

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
      <SearchBar value={search} onChangeAction={handleSearchChange} />
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
