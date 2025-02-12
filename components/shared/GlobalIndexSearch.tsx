'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import clsx from 'clsx/lite'
import { Command } from 'cmdk'
import Fuse from 'fuse.js'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog'
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
      aria-describedby="global-index-search"
      className="fixed inset-0 z-50 overflow-y-auto p-4 pt-[10vh]"
    >
      <div
        className="fixed inset-0 bg-white/60 dark:bg-black/60"
        onClick={() => setOpen(false)}
      />
      <VisuallyHidden asChild>
        <DialogTitle>Global Index Search</DialogTitle>
      </VisuallyHidden>
      <VisuallyHidden asChild>
        <DialogDescription>Search for a page to navigate to</DialogDescription>
      </VisuallyHidden>

      <GlassCard
        transparency="transparent"
        className="relative mx-auto max-w-xl p-2 shadow-2xl"
      >
        <div className="flex flex-col gap-2">
          <Command.Input
            className="w-full rounded-l-xs rounded-tr-xs rounded-br-md bg-white/50 px-4 py-3 placeholder-zinc-400 focus:outline-none dark:bg-black/50 dark:text-white dark:placeholder-zinc-500"
            placeholder="Search (↑↓ to navigate, ↵ to select)"
            autoFocus
            value={query}
            onValueChange={setQuery}
          />
          <Command.List className="max-h-[70vh] overflow-y-auto pr-1 *:flex *:flex-col *:gap-1 md:max-h-[30rem]">
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
                  'transition-colors data-[selected=true]:bg-zinc-300/75 data-[selected=true]:duration-0 dark:data-[selected=true]:bg-zinc-700/75'
                )}
              >
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  width={64}
                  height={64}
                  priority
                  className="pointer-events-none size-16"
                />
                <span className="pointer-events-none flex-1 text-black dark:text-white">
                  {item.title}
                </span>
              </Command.Item>
            ))}
          </Command.List>
        </div>
      </GlassCard>
    </Command.Dialog>
  )
}
