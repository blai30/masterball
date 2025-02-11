'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useRef, useMemo } from 'react'
import clsx from 'clsx/lite'
import Fuse from 'fuse.js'
import { useGlobalIndex } from '@/components/shared/GlobalIndexProvider'
import GlassCard from '@/components/GlassCard'

export default function GlobalIndexSearch() {
  const [open, setOpen] = useState(true)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const router = useRouter()
  const { indexItems } = useGlobalIndex()
  const inputRef = useRef<HTMLInputElement>(null)
  const selectedRef = useRef<HTMLButtonElement>(null)

  const fuse = useMemo(
    () =>
      new Fuse(indexItems, {
        keys: ['title', 'path'],
        threshold: 0.4,
      }),
    [indexItems]
  )

  const filteredItems = useMemo(() => {
    return query.length > 0
      ? fuse.search(query).map((result) => result.item)
      : indexItems
  }, [query, fuse, indexItems])

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  // Scroll selected item into view
  useEffect(() => {
    if (selectedRef.current) {
      selectedRef.current.scrollIntoView({
        block: 'nearest',
        behavior: 'instant',
      })
    }
  }, [selectedIndex])

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen((open) => !open)
      }

      if (!open) return

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          setSelectedIndex((i) => (i < filteredItems.length - 1 ? i + 1 : i))
          break
        case 'ArrowUp':
          event.preventDefault()
          setSelectedIndex((i) => (i > 0 ? i - 1 : 0))
          break
        case 'Enter':
          event.preventDefault()
          if (filteredItems[selectedIndex]) {
            router.push(`/${filteredItems[selectedIndex].path}`)
            setOpen(false)
          }
          break
        case 'Escape':
          setOpen(false)
          break
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [open, filteredItems, selectedIndex, router])

  useEffect(() => {
    if (open) {
      inputRef.current?.focus()
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 pt-[10vh]">
      <div
        className="fixed inset-0 bg-white/60 dark:bg-black/60"
        onClick={() => setOpen(false)}
      />

      <GlassCard
        transparency="transparent"
        className="relative mx-auto max-w-xl overflow-hidden p-2 shadow-2xl"
      >
        <div role="dialog" aria-label="Global Index Search">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-l-xs rounded-tr-xs rounded-br-md p-4 placeholder-zinc-400 focus:outline-none dark:text-white dark:placeholder-zinc-500"
            placeholder="Search (↑↓ to navigate, ↵ to select)"
          />

          <div className="scrollbar max-h-[70vh] overflow-y-auto p-2 md:max-h-[30rem]">
            {filteredItems.length === 0 ? (
              <div className="p-4 text-center text-zinc-500 dark:text-zinc-400">
                No results found
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                {filteredItems.map((item, index) => (
                  <button
                    key={item.id}
                    ref={index === selectedIndex ? selectedRef : null}
                    onClick={() => {
                      router.push(`/${item.path}`)
                      setOpen(false)
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={clsx(
                      'flex w-full cursor-default items-center gap-3 rounded-lg p-2',
                      'rounded-l-xs rounded-tr-xs rounded-br-md',
                      'transition-colors hover:bg-zinc-300/75 hover:duration-0 dark:hover:bg-zinc-700/75',
                      index === selectedIndex &&
                        'bg-zinc-300/75 dark:bg-zinc-700/75'
                    )}
                  >
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      width={64}
                      height={64}
                      className="pointer-events-none size-16"
                    />
                    <span className="pointer-events-none flex-1 text-left text-black dark:text-white">
                      {item.title}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
