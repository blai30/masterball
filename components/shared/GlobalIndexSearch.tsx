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
      <GlassCard variant="link">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={clsx(
            'flex h-8 w-54 cursor-default items-center gap-2 py-1 pr-1 pl-2',
            'rounded-l-xs rounded-tr-xs rounded-br-md',
            'text-md text-zinc-600 dark:text-zinc-400'
          )}
        >
          Find something...
          <kbd
            className={clsx(
              'ml-auto flex gap-1 px-1',
              'rounded-l-xs rounded-tr-xs rounded-br-lg',
              'bg-white text-sm text-zinc-500 dark:bg-black dark:text-zinc-500'
            )}
          >
            <kbd className="font-sans">{modifierKey}</kbd>
            <kbd className="font-sans">K</kbd>
          </kbd>
        </button>
      </GlassCard>

      {/* Command palette dialog not displayed by default */}
      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        shouldFilter={false}
        label="Global Index Search"
        aria-describedby="global-index-search"
        className="fixed inset-0 z-50 overflow-y-auto p-4 pt-[10vh]"
      >
        {/* Overlay backdrop tint */}
        <div
          className="fixed inset-0 bg-white/60 dark:bg-black/60"
          onClick={() => setOpen(false)}
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
                  {query
                    ? 'No results found'
                    : 'Start typing in the field above'}
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
                    'cursor-default p-2',
                    'rounded-l-xs rounded-tr-xs rounded-br-md',
                    'transition-colors data-[selected=true]:bg-zinc-300/75 data-[selected=true]:duration-0 dark:data-[selected=true]:bg-zinc-700/75'
                  )}
                >
                  <div className="flex flex-row items-center justify-start gap-3">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      width={64}
                      height={64}
                      priority
                      className="pointer-events-none size-16"
                    />
                    <div className="flex flex-col items-start justify-center gap-1">
                      <span className="pointer-events-none flex-1 text-black dark:text-white">
                        {item.title}
                      </span>
                      <span className="pointer-events-none flex-1 text-sm text-zinc-600 dark:text-zinc-400">
                        {`/${item.path}`}
                      </span>
                    </div>
                  </div>
                </Command.Item>
              ))}
            </Command.List>
          </div>
        </GlassCard>
      </Command.Dialog>
    </>
  )
}
