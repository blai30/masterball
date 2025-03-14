'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import clsx from 'clsx/lite'
import { Command } from 'cmdk'
import Fuse from 'fuse.js'
import { Search } from 'lucide-react'
import {
  DialogDescription,
  DialogOverlay,
  DialogTitle,
} from '@radix-ui/react-dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { useGlobalIndex } from '@/components/shared/GlobalIndexProvider'
import GlassCard from '@/components/GlassCard'

export default function GlobalIndexSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [modifierKey, setModifierKey] = useState<string>()
  const { indexItems } = useGlobalIndex()
  const router = useRouter()

  const fuse = new Fuse(indexItems, {
    keys: ['title', 'path'],
    threshold: 0.4,
  })

  const filteredItems = useMemo(() => {
    if (!query) return []
    return fuse.search(query, { limit: 20 }).map((result) => result.item)
  }, [query, fuse])

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

  useEffect(() => {
    setModifierKey(
      /(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent) ? '⌘' : 'Ctrl'
    )
  }, [])

  return (
    <>
      {/* Clickable button on the page to open command palette dialog */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={clsx(
          'relative flex h-8 cursor-default items-center gap-2 py-1 pr-2 pl-7',
          'rounded-lg transition-colors hover:duration-0',
          'bg-white/50 hover:bg-zinc-200 focus-visible:bg-zinc-200 dark:bg-black/50 dark:hover:bg-zinc-800 dark:focus-visible:bg-zinc-800'
        )}
      >
        <Search className="absolute left-0 ml-2 size-4 text-zinc-600 dark:text-zinc-400" />
        <span className="text-zinc-600 dark:text-zinc-400">Search</span>
        <kbd
          className={clsx(
            'ml-auto flex gap-1 px-1',
            'text-sm text-zinc-800 dark:text-zinc-200'
          )}
        >
          <kbd className="font-sans">{modifierKey}</kbd>
          <kbd className="font-sans">K</kbd>
        </kbd>
      </button>

      {/* Command palette dialog not displayed by default */}
      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        shouldFilter={false}
        label="Global Index Search"
        className="fixed inset-0 z-50 overflow-y-auto p-4 pt-[10vh]"
      >
        {/* Overlay backdrop tint */}
        <DialogOverlay
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-white/60 dark:bg-black/60"
        />

        {/* Required for screen readers */}
        <VisuallyHidden asChild>
          <DialogTitle>Global Index Search</DialogTitle>
        </VisuallyHidden>
        <VisuallyHidden asChild>
          <DialogDescription>
            Search for a page to navigate to
          </DialogDescription>
        </VisuallyHidden>

        {/* Command palette dialog content */}
        <GlassCard
          transparency="transparent"
          className="relative mx-auto max-w-xl rounded-xl p-2 shadow-2xl"
        >
          <div className="flex flex-col gap-2">
            <div className="relative flex flex-row items-center">
              <Search className="absolute ml-2.5 size-6 text-zinc-400 dark:text-zinc-600" />
              <Command.Input
                value={query}
                onValueChange={setQuery}
                autoFocus
                placeholder="Search (↑↓ to navigate, ↵ to select)"
                className="w-full rounded-md bg-white/50 py-3 pr-4 pl-10.5 placeholder-zinc-400 focus:outline-none dark:bg-black/50 dark:text-white dark:placeholder-zinc-600"
              />
            </div>
            <Command.List className="max-h-[70vh] overflow-y-auto pr-1 *:flex *:flex-col *:gap-1 md:max-h-[30rem]">
              <Command.Empty>
                <div className="py-8 text-center text-zinc-600 dark:text-zinc-400">
                  {query
                    ? 'No results found'
                    : 'Start typing in the field above'}
                </div>
              </Command.Empty>
              {filteredItems.map((item) => {
                return (
                  <Command.Item
                    key={item.path}
                    value={item.path}
                    // keywords={item.keywords}
                    onSelect={() => {
                      router.push(item.path)
                      setOpen(false)
                    }}
                    className={clsx(
                      'cursor-default p-2',
                      'rounded-md',
                      'transition-colors data-[selected=true]:bg-zinc-300/75 data-[selected=true]:duration-0 dark:data-[selected=true]:bg-zinc-700/75'
                    )}
                  >
                    <div className="flex flex-row items-center justify-start gap-3">
                      {/* {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          width={48}
                          height={48}
                          loading="lazy"
                          priority={false}
                          quality={60}
                          className="pointer-events-none size-12 object-contain"
                        />
                      ) : ( */}
                        <div className="size-12 bg-transparent" />
                      {/* )} */}
                      <div className="flex flex-1 flex-row items-center justify-between">
                        <div className="flex flex-col items-start justify-center">
                          <span className="pointer-events-none text-black dark:text-white">
                            {item.title}
                          </span>
                          <span className="pointer-events-none text-sm text-zinc-600 dark:text-zinc-400">
                            {item.path}
                          </span>
                          {/* {item.keywords.join(', ')} */}
                        </div>
                        {/* <span className="pointer-events-none text-sm text-zinc-600 dark:text-zinc-400">
                          {item.path}
                        </span> */}
                      </div>
                    </div>
                  </Command.Item>
                )
              })}
            </Command.List>
          </div>
        </GlassCard>
      </Command.Dialog>
    </>
  )
}
