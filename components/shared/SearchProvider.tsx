'use client'

import Fuse from 'fuse.js'
import React, { createContext, useContext, useMemo, useState } from 'react'

export type SearchItem = {
  id: number
  title: string
  slug: string
  path: string
  keywords: string[]
  imageUrl: string
}

const SearchContext = createContext({
  items: [] as SearchItem[],
  query: '',
  setQuery: (query: string) => {},
})

export function useSearch() {
  return useContext(SearchContext)
}

export function SearchProvider({
  allItems = [],
  children,
}: {
  allItems?: SearchItem[]
  children: React.ReactNode
}) {
  const [query, setQuery] = useState('')
  const fuse = new Fuse(allItems, {
    keys: ['title', 'slug', 'path', 'keywords'],
    includeScore: true,
  })
  const items = useMemo(() => {
    if (!query) {
      return allItems
    }

    return fuse.search(query).map((result) => result.item)
  }, [query, allItems, fuse])

  const value = { items, query, setQuery }

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  )
}
