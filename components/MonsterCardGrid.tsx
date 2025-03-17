'use client'

import { useState, useMemo, useCallback } from 'react'
import Fuse from 'fuse.js'
import { Search } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import MonsterCard from '@/components/MonsterCard'
import Pagination from '@/components/Pagination'
import { getSpeciesData } from '@/lib/api/query-fetchers'
import { getTranslation } from '@/lib/utils/pokeapiHelpers'

// export default function MonsterCardGrid({
//   speciesData,
// }: {
//   speciesData: {
//     id: number
//     slug: string
//     name: string
//   }[]
// }) {
export default function MonsterCardGrid() {
  const { data } = useQuery({
    queryKey: ['species-list'],
    queryFn: getSpeciesData,
  })

  const speciesData = data!.map((specie) => ({
    id: specie.id,
    slug: specie.name,
    name: getTranslation(specie.names, 'name')!,
  }))

  const [query, setQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 60
  // Memoize the Fuse instance to prevent recreation on every render
  const fuse = useMemo(
    () =>
      new Fuse(speciesData, {
        keys: ['id', 'slug', 'name'],
        threshold: 0.4,
      }),
    [speciesData]
  )

  const filteredItems = useMemo(() => {
    return query ? fuse.search(query).map((result) => result.item) : speciesData
  }, [query, fuse, speciesData])

  const totalPages = useMemo(() => {
    return Math.ceil(filteredItems.length / itemsPerPage)
  }, [filteredItems])

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredItems.slice(startIndex, endIndex)
  }, [filteredItems, currentPage])

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const handleQueryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value)
      setCurrentPage(1)
    },
    []
  )

  return (
    <div className="xs:gap-8 flex flex-col gap-4">
      <div className="flex flex-col items-center justify-center p-4">
        <label htmlFor="filter" className="sr-only">
          Filter
        </label>
        <div className="relative flex flex-row items-center text-lg/10">
          <input
            id="filter"
            name="filter"
            type="search"
            placeholder="Filter by name or ID"
            value={query}
            onChange={handleQueryChange}
            className="appearance-none border-b-2 border-zinc-600 bg-transparent pr-10 pl-3 text-zinc-900 outline-hidden transition-colors placeholder:text-zinc-500 focus:border-zinc-900 focus:duration-0 focus:outline-none dark:border-zinc-400 dark:text-zinc-100 dark:focus:border-zinc-100 [&::-webkit-search-decoration]:hidden [&::-webkit-search-results-button]:hidden [&::-webkit-search-results-decoration]:hidden"
          />
          <Search
            size={24}
            className="absolute top-1/2 right-2 h-[1lh] -translate-y-1/2 text-zinc-500 dark:text-zinc-500"
          />
        </div>
      </div>
      <div className="xs:gap-8 flex flex-col gap-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChangeAction={handlePageChange}
        />
        <ul className="2xs:grid-cols-3 xs:grid-cols-3 grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10">
          {paginatedItems.map((object) => (
            <li key={object.id} className="col-span-1">
              <MonsterCard
                id={object.id}
                slug={object.slug}
                name={object.name}
              />
            </li>
          ))}
        </ul>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChangeAction={handlePageChange}
        />
      </div>
    </div>
  )
}
