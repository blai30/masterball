'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import clsx from 'clsx/lite'
import { Command } from 'cmdk'
import Fuse from 'fuse.js'
import { useGlobalIndex } from '@/components/shared/GlobalIndexProvider'
import GlassCard from '@/components/GlassCard'

export default function GlobalIndexSearch() {
  const [open, setOpen] = useState(true)
  const [query, setQuery] = useState('')
  const { indexItems } = useGlobalIndex()
  const router = useRouter()

  const fuse = new Fuse(indexItems, {
    keys: ['title'],
    threshold: 0.4,
  })

  const filteredItems = useMemo(() => {
    if (!query) return indexItems
    return fuse.search(query).map((result) => result.item)
  }, [query, indexItems, fuse])

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen((open) => !open)
      }
    }

    const controller = new AbortController()
    document.addEventListener('keydown', down, { signal: controller.signal })
    return () => {
      controller.abort()
    }
  }, [])

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      shouldFilter={false}
      label="Global Index Search"
      className="fixed inset-0 z-50 overflow-y-auto p-4 pt-[10vh]"
    >
      <div
        className="fixed inset-0 bg-white/60 dark:bg-black/60"
        onClick={() => setOpen(false)}
      />

      <GlassCard
        transparency="transparent"
        className="relative mx-auto max-w-xl overflow-hidden p-2 shadow-2xl"
      >
        <Command.Input
          className="w-full rounded-l-xs rounded-tr-xs rounded-br-md p-4 placeholder-zinc-400 focus:outline-none dark:text-white dark:placeholder-zinc-500"
          placeholder="Search"
          autoFocus
          value={query}
          onValueChange={setQuery}
        />
        <Command.List className="scrollbar max-h-[70vh] overflow-y-auto p-2 md:max-h-[30rem]">
          <Command.Empty>
            <div className="p-4 text-center text-zinc-500 dark:text-zinc-400">
              No results found
            </div>
          </Command.Empty>
          {filteredItems.map((item) => (
            <Command.Item
              key={item.id}
              value={item.slug}
              // keywords={item.keywords}
              onSelect={() => {
                router.push(`/${item.path}`)
                setOpen(false)
              }}
              className={clsx(
                'flex cursor-default items-center gap-3 rounded-lg p-2',
                'rounded-l-xs rounded-tr-xs rounded-br-md',
                'transition-colors hover:bg-zinc-300/75 hover:duration-0 dark:hover:bg-zinc-700/75'
              )}
            >
              <Image
                src={item.imageUrl}
                alt={item.title}
                width={64}
                height={64}
                className="pointer-events-none size-16"
              />
              <span className="pointer-events-none flex-1 text-black dark:text-white">
                {item.title}
              </span>
            </Command.Item>
          ))}
        </Command.List>
      </GlassCard>
    </Command.Dialog>
  )
}
