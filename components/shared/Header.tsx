'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { memo } from 'react'
import clsx from 'clsx'
import { motion } from 'motion/react'
import { Accessibility, Backpack, Cat, Swords } from 'lucide-react'
import VersionGroupSelector from '@/components/shared/VersionGroupSelector'

const ThemeSwitch = dynamic(() => import('@/components/shared/ThemeSwitch'), {
  ssr: false,
})

// const GlobalIndexSearch = dynamic(
//   () => import('@/components/shared/GlobalIndexSearch'),
//   { ssr: false }
// )

// const VersionGroupSelector = dynamic(
//   () => import('@/components/shared/VersionGroupSelector'),
//   { ssr: false }
// )

const navItems = [
  { label: 'Pokemon', url: '/', icon: Cat },
  // { label: 'Items', url: '/item', icon: Backpack },
  // { label: 'Moves', url: '/move', icon: Swords },
  // { label: 'Abilities', url: '/ability', icon: Accessibility },
  // { label: 'Types', url: '/type' },
  // { label: 'Egg Groups', url: '/egg-group' },
  // { label: 'Damage Classes', url: '/damage-class' },
]

function Header() {
  const pathname = usePathname()

  const isActiveRoute = (url: string) => {
    if (url === '/') {
      return (
        pathname === '/' ||
        !navItems.some(
          (item) => item.url !== '/' && pathname.startsWith(item.url)
        )
      )
    }

    return pathname.startsWith(url)
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-zinc-200/50 backdrop-blur-2xl dark:bg-zinc-800/50">
      <nav className="container mx-auto px-4">
        <div className="flex flex-row flex-wrap items-center justify-center gap-4 py-2 md:justify-between">
          <ul className="flex flex-row flex-wrap items-center gap-4">
            {navItems.map((item) => {
              const active = isActiveRoute(item.url)

              return (
                <li key={item.url} className="relative">
                  {active && (
                    <motion.div
                      layoutId="active-nav"
                      className="absolute inset-0 -z-10 rounded-lg bg-white/50 dark:bg-black/50"
                    />
                  )}
                  <Link
                    href={item.url}
                    className={clsx(
                      'inline-flex items-center gap-2 rounded-lg px-3 py-1.5',
                      'text-sm font-medium transition-colors hover:duration-0',
                      !active &&
                        'text-zinc-600 hover:bg-zinc-200 hover:text-zinc-800 focus-visible:bg-zinc-200 focus-visible:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 dark:focus-visible:bg-zinc-800 dark:focus-visible:text-zinc-200'
                    )}
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
          <ul className="flex flex-row flex-wrap items-center gap-4">
            {/* <li>
              <GlobalIndexSearch />
            </li> */}
            <li>
              <VersionGroupSelector />
            </li>
            <li>
              <ThemeSwitch />
            </li>
          </ul>
        </div>
      </nav>
    </header>
  )
}

export default memo(Header)
