import { useCallback, useEffect, useMemo, useState } from 'react'
import Fuse from 'fuse.js'
import { useDebouncedCallback } from 'use-debounce'
import { useVersionGroup } from '@/lib/stores/version-group'
import {
  type ItemPocketKey,
  ItemPocketLabels,
  type ItemCategoryKey,
  ItemCategoryLabels,
} from '@/lib/utils/pokeapi-helpers'
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
  const { versionGroup } = useVersionGroup()

  const getSearchParam = (key: string) => {
    if (typeof window === 'undefined') return null
    return new URLSearchParams(window.location.search).get(key)
  }

  const [search, setSearch] = useState(() => getSearchParam('q') ?? '')
  const [pocketFilters, setPocketFilters] = useState<string[]>(
    () => getSearchParam('pockets')?.split(',').filter(Boolean) ?? []
  )
  const [categoryFilters, setCategoryFilters] = useState<string[]>(
    () => getSearchParam('categories')?.split(',').filter(Boolean) ?? []
  )
  const [currentPage, setCurrentPage] = useState(
    () => Number(getSearchParam('p')) || DEFAULT_PAGE
  )

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
      window.history.replaceState(
        null,
        '',
        params.toString() ? `?${params}` : window.location.pathname
      )
    },
    500
  )

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

  const availableFilters = useMemo(() => {
    const filters: FilterConfig[] = []

    const uniquePockets = Array.from(new Set(data.map((item) => item.pocket)))
    if (uniquePockets.length > 0) {
      filters.push({
        label: 'Pocket',
        options: uniquePockets
          .map((pocket) => ({
            label: ItemPocketLabels[pocket as ItemPocketKey] || pocket,
            value: pocket,
          }))
          .sort((a, b) => a.label.localeCompare(b.label)),
        values: pocketFilters,
        onChange: handlePocketFilterChange,
      })
    }

    const pocketFilteredData =
      pocketFilters.length > 0
        ? data.filter((item) => pocketFilters.includes(item.pocket))
        : data

    const uniqueCategories = Array.from(
      new Set(pocketFilteredData.map((item) => item.category))
    )
    if (uniqueCategories.length > 0) {
      filters.push({
        label: 'Category',
        options: uniqueCategories
          .map((category) => ({
            label: ItemCategoryLabels[category as ItemCategoryKey] || category,
            value: category,
          }))
          .sort((a, b) => a.label.localeCompare(b.label)),
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
      const fuse = new Fuse(filtered, { keys: ['name'], threshold: 0.4 })
      filtered = fuse.search(search).map((result) => result.item)
    }

    return filtered
  }, [data, filterByVersionGroup, search, versionGroup, pocketFilters, categoryFilters])

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
