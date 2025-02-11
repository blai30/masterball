'use client'

import React, { createContext, useContext } from 'react'

export type IndexItem = {
  id: number
  title: string
  slug: string
  path: string
  keywords: string[]
  imageUrl: string
}

const SearchContext = createContext({
  indexItems: [] as IndexItem[],
})

export function useGlobalIndex() {
  return useContext(SearchContext)
}

export function GlobalIndexProvider({
  indexItems = [],
  children,
}: {
  indexItems?: IndexItem[]
  children: React.ReactNode
}) {
  const value = { indexItems }

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  )
}
