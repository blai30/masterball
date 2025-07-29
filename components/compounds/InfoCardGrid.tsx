'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import Fuse from 'fuse.js'
import { useDebouncedCallback } from 'use-debounce'
import { useVersionGroup } from '@/lib/stores/version-group'
import CardGrid from '@/components/compounds/CardGrid'
import InfoCard, { type InfoCardProps } from '@/components/compounds/InfoCard'
import FilterBar from '@/components/shared/FilterBar'
import SearchBar from '@/components/shared/SearchBar'

const DEFAULT_PAGE = 1
const ITEMS_PER_PAGE = 48

type InfoCardGridProps = {
  data: InfoCardProps[]
  filterByVersionGroup?: boolean
  itemsPerPage?: number
  enableFiltering?: boolean
  className?: string
}

export default function InfoCardGrid({
  data,
  filterByVersionGroup = false,
  itemsPerPage = ITEMS_PER_PAGE,
  enableFiltering = true,
  className,
}: InfoCardGridProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { versionGroup } = useVersionGroup()

  const [search, setSearch] = useState(() => searchParams.get('q') ?? '')
  const [tagFilters, setTagFilters] = useState<string[]>(
    () => searchParams.get('tags')?.split(',').filter(Boolean) ?? []
  )
  const [currentPage, setCurrentPage] = useState(
    () => Number(searchParams.get('p')) || DEFAULT_PAGE
  )

  // Debounced URL sync
  const syncUrlParams = useDebouncedCallback(
    (state: { search: string; tagFilters: string[]; currentPage: number }) => {
      const params = new URLSearchParams()
      if (state.search) {
        params.set('q', state.search)
      }
      if (state.tagFilters.length > 0) {
        params.set('tags', state.tagFilters.join(','))
      }
      if (state.currentPage !== DEFAULT_PAGE) {
        params.set('p', String(state.currentPage))
      }
      router.replace(params.toString() ? `?${params}` : '?', { scroll: false })
    },
    500
  )

  // Sync all state to URL
  useEffect(() => {
    syncUrlParams({ search, tagFilters, currentPage })
  }, [search, tagFilters, currentPage, syncUrlParams])

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value)
    setCurrentPage(DEFAULT_PAGE)
  }, [])

  const handleTagFilterChange = useCallback((values: string | string[]) => {
    setTagFilters(Array.isArray(values) ? values : [values])
    setCurrentPage(DEFAULT_PAGE)
  }, [])

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  // Create filter options from available tags
  const availableTagFilters = useMemo(() => {
    if (!enableFiltering) return []

    const tagLabels = new Set<string>()
    data.forEach((item) => {
      item.tags?.forEach((tag) => tagLabels.add(tag.label))
    })

    if (tagLabels.size === 0) return []

    return [
      {
        label: 'Tags',
        options: Array.from(tagLabels)
          .sort()
          .map((label) => ({ label, value: label })),
        values: tagFilters,
        onChange: handleTagFilterChange,
      },
    ]
  }, [data, enableFiltering, tagFilters, handleTagFilterChange])

  /**
   * Returns filtered data for grid display.
   */
  const filteredData = useMemo(() => {
    let filtered = filterByVersionGroup
      ? data.filter((resource) =>
          resource.flavorTextEntries.some(
            (entry) => entry.version_group?.name === versionGroup
          )
        )
      : data

    // Apply tag filters - item must have ALL selected tags
    if (enableFiltering && tagFilters.length > 0) {
      filtered = filtered.filter((item) => {
        if (!item.tags) return false
        return tagFilters.every((selectedLabel) =>
          item.tags!.some((tag) => tag.label === selectedLabel)
        )
      })
    }

    // Apply search
    if (search) {
      const fuse = new Fuse(filtered, {
        keys: ['name'],
        threshold: 0.4,
      })
      filtered = fuse.search(search).map((result) => result.item)
    }

    return filtered
  }, [
    data,
    filterByVersionGroup,
    search,
    versionGroup,
    enableFiltering,
    tagFilters,
  ])

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-4 lg:flex-row">
        <SearchBar value={search} onChangeAction={handleSearchChange} />
        {enableFiltering && availableTagFilters.length > 0 && (
          <FilterBar filters={availableTagFilters} />
        )}
      </div>
      <CardGrid
        data={filteredData}
        renderCardAction={(props: InfoCardProps) => <InfoCard props={props} />}
        getKeyAction={(item: InfoCardProps) => `${item.slug}-${item.id}`}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChangeAction={handlePageChange}
        className={
          className ??
          'grid w-full grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        }
      />
    </div>
  )
}
