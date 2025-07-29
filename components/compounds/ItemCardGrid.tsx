'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import Fuse from 'fuse.js'
import { useDebouncedCallback } from 'use-debounce'
import { useVersionGroup } from '@/lib/stores/version-group'
import {
  ItemPocketKey,
  ItemPocketLabels,
  ItemCategoryKey,
  ItemCategoryLabels,
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
  const [pocketFilters, setPocketFilters] = useState<string[]>(
    () => searchParams.get('pockets')?.split(',').filter(Boolean) ?? []
  )
  const [categoryFilters, setCategoryFilters] = useState<string[]>(
    () => searchParams.get('categories')?.split(',').filter(Boolean) ?? []
  )
  const [currentPage, setCurrentPage] = useState(
    () => Number(searchParams.get('p')) || DEFAULT_PAGE
  )

  // Debounced URL sync
  const syncUrlParams = useDebouncedCallback(
    (state: {
      search: string
      pocketFilters: string[]
      categoryFilters: string[]
      currentPage: number
    }) => {
      const params = new URLSearchParams()
      if (state.search) params.set('q', state.search)
      if (state.pocketFilters.length > 0)
        params.set('pockets', state.pocketFilters.join(','))
      if (state.categoryFilters.length > 0)
        params.set('categories', state.categoryFilters.join(','))
      if (state.currentPage !== DEFAULT_PAGE)
        params.set('p', String(state.currentPage))
      router.replace(params.toString() ? `?${params}` : '?', { scroll: false })
    },
    500
  )

  // Sync all state to URL
  useEffect(() => {
    syncUrlParams({ search, pocketFilters, categoryFilters, currentPage })
  }, [search, pocketFilters, categoryFilters, currentPage, syncUrlParams])

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

  // Create filter options from available item categories and pockets in the data
  const availableFilters = useMemo(() => {
    const filters: FilterConfig[] = []

    const uniquePockets = Array.from(new Set(data.map((item) => item.pocket)))

    if (uniquePockets.length > 0) {
      const pocketOptions = uniquePockets.map((pocket) => ({
        label: ItemPocketLabels[pocket as ItemPocketKey] || pocket,
        value: pocket,
      }))

      filters.push({
        label: 'Pocket',
        options: pocketOptions.sort((a, b) => a.label.localeCompare(b.label)),
        values: pocketFilters,
        onChange: handlePocketFilterChange,
      })
    }

    // Filter data by pocket filters first, then get available categories
    const pocketFilteredData =
      pocketFilters.length > 0
        ? data.filter((item) => pocketFilters.includes(item.pocket))
        : data

    const uniqueCategories = Array.from(
      new Set(pocketFilteredData.map((item) => item.category))
    )

    if (uniqueCategories.length > 0) {
      const categoryOptions = uniqueCategories.map((category) => ({
        label: ItemCategoryLabels[category as ItemCategoryKey] || category,
        value: category,
      }))

      filters.push({
        label: 'Category',
        options: categoryOptions.sort((a, b) => a.label.localeCompare(b.label)),
        values: categoryFilters,
        onChange: handleCategoryFilterChange,
      })
    }

    return filters
  }, [
    data,
    pocketFilters,
    categoryFilters,
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

    if (pocketFilters.length > 0) {
      filtered = filtered.filter((item) => pocketFilters.includes(item.pocket))
    }

    if (categoryFilters.length > 0) {
      filtered = filtered.filter((item) =>
        categoryFilters.includes(item.category)
      )
    }

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
    pocketFilters,
    categoryFilters,
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
