import Fuse from 'fuse.js'
import { useState } from 'react'

import CardGrid from '@/components/compounds/CardGrid'
import ItemCard, { type ItemCardProps } from '@/components/compounds/ItemCard'
import FilterBar, { type FilterConfig } from '@/components/shared/FilterBar'
import SearchBar from '@/components/shared/SearchBar'
import { useUrlSync } from '@/lib/hooks/useUrlSync'
import { useVersionGroup } from '@/lib/stores/version-group'
import {
  type ItemPocketKey,
  ItemPocketLabels,
  type ItemCategoryKey,
  ItemCategoryLabels,
} from '@/lib/utils/pokeapi-helpers'

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

  const [search, setSearch] = useState<string>(() => {
    if (typeof window === 'undefined') return ''
    return new URLSearchParams(window.location.search).get('q') ?? ''
  })
  const [pocketFilters, setPocketFilters] = useState<string[]>(() => {
    if (typeof window === 'undefined') return []
    return (
      new URLSearchParams(window.location.search).get('pockets')?.split(',').filter(Boolean) ?? []
    )
  })
  const [categoryFilters, setCategoryFilters] = useState<string[]>(() => {
    if (typeof window === 'undefined') return []
    return (
      new URLSearchParams(window.location.search).get('categories')?.split(',').filter(Boolean) ??
      []
    )
  })
  const [currentPage, setCurrentPage] = useState<number>(() => {
    if (typeof window === 'undefined') return DEFAULT_PAGE
    return Number(new URLSearchParams(window.location.search).get('p')) || DEFAULT_PAGE
  })

  // Sync all state to URL
  useUrlSync(
    () => ({ search, pocketFilters, categoryFilters, currentPage }),
    {
      search: { key: 'q', defaultValue: '' },
      pocketFilters: { key: 'pockets', defaultValue: [] },
      categoryFilters: { key: 'categories', defaultValue: [] },
      currentPage: { key: 'p', defaultValue: DEFAULT_PAGE },
    },
    [search, pocketFilters, categoryFilters, currentPage]
  )

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setCurrentPage(DEFAULT_PAGE)
  }

  const handleCategoryFilterChange = (values: string | string[]) => {
    setCategoryFilters(Array.isArray(values) ? values : [values])
    setCurrentPage(DEFAULT_PAGE)
  }

  const handlePocketFilterChange = (values: string | string[]) => {
    setPocketFilters(Array.isArray(values) ? values : [values])
    setCurrentPage(DEFAULT_PAGE)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Create filter options from available item categories and pockets in the data
  const availableFilters = (() => {
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
      pocketFilters.length > 0 ? data.filter((item) => pocketFilters.includes(item.pocket)) : data

    const uniqueCategories = Array.from(new Set(pocketFilteredData.map((item) => item.category)))

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
  })()

  const fuse = new Fuse(data, {
    keys: ['name'],
    threshold: 0.4,
  })

  /**
   * Returns filtered data for grid display.
   */
  const filteredData = (() => {
    // Search first (Fuse is stable across filter changes)
    let results = search ? fuse.search(search).map((result) => result.item) : data

    if (filterByVersionGroup) {
      results = results.filter((resource) =>
        resource.flavorTextEntries.some((entry) => entry.version_group?.name === versionGroup)
      )
    }

    if (pocketFilters.length > 0) {
      results = results.filter((item) => pocketFilters.includes(item.pocket))
    }

    if (categoryFilters.length > 0) {
      results = results.filter((item) => categoryFilters.includes(item.category))
    }

    return results
  })()

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-4 lg:flex-row">
        <SearchBar value={search} onChangeAction={handleSearchChange} />
        {availableFilters.length > 0 && <FilterBar filters={availableFilters} />}
      </div>
      <CardGrid
        data={filteredData}
        renderCardAction={(props: ItemCardProps) => <ItemCard props={props} />}
        getKeyAction={(item: ItemCardProps) => `${item.slug}-${item.id}`}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChangeAction={handlePageChange}
        className={
          className ?? 'grid w-full grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        }
      />
    </div>
  )
}
