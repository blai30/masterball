'use client'

import React from 'react'
import { Search } from 'lucide-react'

export interface SearchBarProps {
  value: string
  onChangeAction: (value: string) => void
  placeholder?: string
  className?: string
}

export default function SearchBar({
  value,
  onChangeAction,
  placeholder = 'Search...',
  className,
}: SearchBarProps) {
  return (
    <div
      className={`relative flex w-full max-w-md flex-row items-center text-lg/10 ${className ?? ''}`}
    >
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        id="search"
        name="search"
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChangeAction(e.target.value)}
        className="w-full appearance-none border-b-2 border-zinc-600 bg-transparent pr-10 pl-3 text-zinc-900 outline-hidden transition-colors placeholder:text-zinc-500 focus:border-zinc-900 focus:duration-0 focus:outline-none dark:border-zinc-400 dark:text-zinc-100 dark:focus:border-zinc-100 [&::-webkit-search-decoration]:hidden [&::-webkit-search-results-button]:hidden [&::-webkit-search-results-decoration]:hidden"
      />
      <Search
        size={24}
        className="absolute top-1/2 right-2 h-[1lh] -translate-y-1/2 text-zinc-500 dark:text-zinc-500"
      />
    </div>
  )
}
