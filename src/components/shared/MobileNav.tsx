import { Backpack, Cat, Shield, Swords } from 'lucide-react'
import { motion } from 'motion/react'
import { lazy, Suspense, useState } from 'react'

import VersionGroupSelector from '@/components/shared/VersionGroupSelector'
import {
  DialogBackdrop,
  DialogPanel,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from '@/components/ui/Dialog'
import { normalizePathname, toHref } from '@/lib/utils/path'

const ThemeSwitch = lazy(() => import('@/components/shared/ThemeSwitch'))

const navItems = [
  { label: 'Pokemon', url: '/', icon: Cat },
  { label: 'Items', url: '/item', icon: Backpack },
  { label: 'Moves', url: '/move', icon: Swords },
  { label: 'Abilities', url: '/ability', icon: Shield },
]

const itemClass =
  'flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left text-base/6 font-medium text-zinc-950 transition-colors hover:bg-zinc-950/5 sm:py-2 sm:text-sm/5 dark:text-white dark:hover:bg-white/5'

export default function MobileNav({ pathname }: { pathname: string }) {
  const [showSidebar, setShowSidebar] = useState(false)
  const currentPathname = normalizePathname(pathname)

  const isActiveRoute = (url: string) => {
    if (url === '/') {
      return (
        currentPathname === '/' ||
        !navItems.some((item) => item.url !== '/' && currentPathname.startsWith(item.url))
      )
    }
    return currentPathname.startsWith(url)
  }

  return (
    <>
      <div className="py-2.5 lg:hidden">
        <button
          type="button"
          onClick={() => setShowSidebar(true)}
          aria-label="Open navigation"
          className={itemClass}
        >
          <svg viewBox="0 0 20 20" aria-hidden="true" className="size-6 fill-zinc-500">
            <path d="M2 6.75C2 6.33579 2.33579 6 2.75 6H17.25C17.6642 6 18 6.33579 18 6.75C18 7.16421 17.6642 7.5 17.25 7.5H2.75C2.33579 7.5 2 7.16421 2 6.75ZM2 13.25C2 12.8358 2.33579 12.5 2.75 12.5H17.25C17.6642 12.5 18 12.8358 18 13.25C18 13.6642 17.6642 14 17.25 14H2.75C2.33579 14 2 13.6642 2 13.25Z" />
          </svg>
        </button>
      </div>

      <DialogRoot open={showSidebar} onOpenChange={setShowSidebar}>
        <DialogPortal>
          <DialogBackdrop className="lg:hidden" />
          <DialogPanel className="lg:hidden">
            <DialogTitle className="sr-only">Navigation</DialogTitle>
            <div className="flex h-full flex-col rounded-lg bg-white shadow-xs ring-1 ring-zinc-950/5 dark:bg-zinc-900 dark:ring-white/10">
              <div className="-mb-3 px-4 pt-3">
                <button
                  type="button"
                  onClick={() => setShowSidebar(false)}
                  aria-label="Close navigation"
                  className={itemClass}
                >
                  <svg viewBox="0 0 20 20" aria-hidden="true" className="size-6 fill-zinc-500">
                    <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                  </svg>
                </button>
              </div>
              <nav className="flex flex-1 flex-col overflow-y-auto p-4">
                <div className="flex flex-col gap-0.5">
                  {navItems.map((item) => {
                    const active = isActiveRoute(item.url)
                    const Icon = item.icon
                    return (
                      <span key={item.url} className="relative">
                        {active && (
                          <motion.span
                            layoutId="current-indicator"
                            className="absolute inset-y-2 -left-4 w-0.5 rounded-full bg-zinc-950 dark:bg-white"
                          />
                        )}
                        <a
                          href={toHref(item.url)}
                          onClick={() => setShowSidebar(false)}
                          aria-current={active ? 'page' : undefined}
                          className={itemClass}
                        >
                          <Icon size={20} />
                          <span className="truncate">{item.label}</span>
                        </a>
                      </span>
                    )
                  })}
                </div>
                <hr className="my-4 border-t border-zinc-950/5 dark:border-white/5" />
                <div className="flex items-start gap-3">
                  <VersionGroupSelector />
                  <Suspense fallback={null}>
                    <ThemeSwitch />
                  </Suspense>
                </div>
              </nav>
            </div>
          </DialogPanel>
        </DialogPortal>
      </DialogRoot>
    </>
  )
}
