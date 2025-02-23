'use client'

import { useState, useMemo } from 'react'
import Fuse from 'fuse.js'
import MonsterCard from '@/components/MonsterCard'
import { Monster } from '@/lib/utils/pokeapiHelpers'

export default function MonsterCardGrid({ monsters }: { monsters: Monster[] }) {
  const [query, setQuery] = useState('')

  const fuse = new Fuse(monsters, {
    keys: ['id', 'key', 'name'],
    threshold: 0.4,
  })

  const filteredItems = useMemo(() => {
    if (!query) return monsters
    return fuse.search(query).map((result) => result.item)
  }, [query, fuse, monsters])

  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center justify-center p-4">
        <label htmlFor="filter" className="sr-only">
          Filter
        </label>
        <input
          id="filter"
          name="filter"
          type="search"
          placeholder="Filter by name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="appearance-none border-b-2 border-zinc-600 bg-transparent px-3 py-1.5 text-lg text-zinc-900 outline-hidden placeholder:text-zinc-500 focus:outline-none dark:border-zinc-400 dark:text-zinc-100 [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden [&::-webkit-search-results-button]:hidden [&::-webkit-search-results-decoration]:hidden"
        />
      </div>
      <ul className="2xs:grid-cols-2 xs:grid-cols-3 mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10">
        {filteredItems.map((monster) => (
          <li key={monster.name} className="col-span-1">
            <MonsterCard key={monster.id} species={monster.species} />
          </li>
        ))}
      </ul>
    </div>
  )
}
