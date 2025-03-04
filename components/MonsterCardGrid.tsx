'use client'

import { useState, useMemo } from 'react'
import Fuse from 'fuse.js'
import { Monster } from '@/lib/utils/pokeapiHelpers'
import MonsterCard from '@/components/MonsterCard'
import Pagination from '@/components/Pagination'

export default function MonsterCardGrid({ monsters }: { monsters: Monster[] }) {
  const [query, setQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage =
    process?.env?.NODE_ENV && process?.env?.NODE_ENV === 'development' ? 5 : 60

  const fuse = new Fuse(monsters, {
    keys: ['id', 'key', 'name'],
    threshold: 0.4,
  })

  const filteredItems = useMemo(() => {
    return query ? fuse.search(query).map((result) => result.item) : monsters
  }, [query, fuse, monsters])

  const totalPages = useMemo(() => {
    return Math.ceil(filteredItems.length / itemsPerPage)
  }, [filteredItems, itemsPerPage])

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredItems.slice(startIndex, endIndex)
  }, [filteredItems, currentPage, itemsPerPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="container mx-auto">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col items-center justify-center p-4">
          <label htmlFor="filter" className="sr-only">
            Filter
          </label>
          <input
            id="filter"
            name="filter"
            type="search"
            placeholder="Filter by name or ID"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setCurrentPage(1)
            }}
            className="appearance-none border-b-2 border-zinc-600 bg-transparent px-3 py-1.5 text-lg text-zinc-900 outline-hidden placeholder:text-zinc-500 focus:outline-none dark:border-zinc-400 dark:text-zinc-100 [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden [&::-webkit-search-results-button]:hidden [&::-webkit-search-results-decoration]:hidden"
          />
        </div>
        <div className="flex flex-col gap-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChangeAction={handlePageChange}
          />
          <ul className="2xs:grid-cols-2 xs:grid-cols-3 grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10">
            {paginatedItems.map((monster) => (
              <li key={monster.id} className="col-span-1">
                <MonsterCard species={monster.species} />
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
    </div>
  )
}
