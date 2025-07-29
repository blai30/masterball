'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import Fuse from 'fuse.js'
import { useDebouncedCallback } from 'use-debounce'
import { useVersionGroup } from '@/lib/stores/version-group'
import {
  ItemCategoryKey,
  ItemCategoryLabels,
  ItemPocketKey,
  ItemPocketLabels,
} from '@/lib/utils/pokeapiHelpers'
import CardGrid from '@/components/compounds/CardGrid'
import ItemCard, { type ItemCardProps } from '@/components/compounds/ItemCard'
import FilterBar, { type FilterConfig } from '@/components/shared/FilterBar'
import SearchBar from '@/components/shared/SearchBar'

const DEFAULT_PAGE = 1
const ITEMS_PER_PAGE = 48

type ItemCardGridProps = {
  data: ItemCardProps[]
  filterByVersionGroup?: boolean
  itemsPerPage?: number
  className?: string
}

export default function ItemCardGrid({
  data,
  filterByVersionGroup = false,
  itemsPerPage = ITEMS_PER_PAGE,
  className,
}: ItemCardGridProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { versionGroup } = useVersionGroup()

  const [search, setSearch] = useState(() => searchParams.get('q') ?? '')
  const [categoryFilters, setCategoryFilters] = useState<string[]>(
    () => searchParams.get('categories')?.split(',').filter(Boolean) ?? []
  )
  const [pocketFilters, setPocketFilters] = useState<string[]>(
    () => searchParams.get('pockets')?.split(',').filter(Boolean) ?? []
  )
  const [currentPage, setCurrentPage] = useState(
    () => Number(searchParams.get('p')) || DEFAULT_PAGE
  )

  // Debounced URL sync
  const syncUrlParams = useDebouncedCallback(
    (state: {
      search: string
      categoryFilters: string[]
      pocketFilters: string[]
      currentPage: number
    }) => {
      const params = new URLSearchParams()
      if (state.search) params.set('q', state.search)
      if (state.categoryFilters.length > 0)
        params.set('categories', state.categoryFilters.join(','))
      if (state.pocketFilters.length > 0)
        params.set('pockets', state.pocketFilters.join(','))
      if (state.currentPage !== DEFAULT_PAGE)
        params.set('p', String(state.currentPage))
      router.replace(params.toString() ? `?${params}` : '?', { scroll: false })
    },
    500
  )

  // Sync all state to URL
  useEffect(() => {
    syncUrlParams({ search, categoryFilters, pocketFilters, currentPage })
  }, [search, categoryFilters, pocketFilters, currentPage, syncUrlParams])

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value)
    setCurrentPage(DEFAULT_PAGE)
  }, [])

  const handleCategoryFilterChange = useCallback(
    (values: string | string[]) => {
      setCategoryFilters(Array.isArray(values) ? values : [values])
      setCurrentPage(DEFAULT_PAGE)
    },
    []
  )

  const handlePocketFilterChange = useCallback((values: string | string[]) => {
    setPocketFilters(Array.isArray(values) ? values : [values])
    setCurrentPage(DEFAULT_PAGE)
  }, [])

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  // Create filter options from available item categories and pockets
  const availableFilters = useMemo(() => {
    const filters: FilterConfig[] = []

    // Category filter using enum
    const categoryOptions = Object.entries(ItemCategoryKey).map(
      ([label, value]) => ({
        label: ItemCategoryLabels[value],
        value,
      })
    )

    filters.push({
      label: 'Category',
      options: categoryOptions.sort((a, b) => a.label.localeCompare(b.label)),
      values: categoryFilters,
      onChange: handleCategoryFilterChange,
    })

    // Pocket filter using enum
    const pocketOptions = Object.entries(ItemPocketKey).map(
      ([label, value]) => ({
        label: ItemPocketLabels[value],
        value,
      })
    )

    filters.push({
      label: 'Pocket',
      options: pocketOptions.sort((a, b) => a.label.localeCompare(b.label)),
      values: pocketFilters,
      onChange: handlePocketFilterChange,
    })

    return filters
  }, [
    categoryFilters,
    pocketFilters,
    handleCategoryFilterChange,
    handlePocketFilterChange,
  ])

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

    // Apply category filters
    if (categoryFilters.length > 0) {
      filtered = filtered.filter((item) =>
        categoryFilters.includes(item.category)
      )
    }

    // Apply pocket filters
    if (pocketFilters.length > 0) {
      filtered = filtered.filter((item) => pocketFilters.includes(item.pocket))
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
    categoryFilters,
    pocketFilters,
  ])

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-4 lg:flex-row">
        <SearchBar value={search} onChangeAction={handleSearchChange} />
        {availableFilters.length > 0 && (
          <FilterBar filters={availableFilters} />
        )}
      </div>
      <CardGrid
        data={filteredData}
        renderCardAction={(props: ItemCardProps) => <ItemCard props={props} />}
        getKeyAction={(item: ItemCardProps) => `${item.slug}-${item.id}`}
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
