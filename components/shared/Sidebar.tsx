'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'motion/react'
import { Accessibility, Backpack, Cat, Menu, Swords, X } from 'lucide-react'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from '@headlessui/react'
import { useState } from 'react'
import clsx from 'clsx/lite'

const ThemeSwitch = dynamic(() => import('@/components/shared/ThemeSwitch'), {
  ssr: false,
})

const GlobalIndexSearch = dynamic(
  () => import('@/components/shared/GlobalIndexSearch'),
  {
    ssr: false,
  }
)

const navigation = [
  { label: 'Pokemon', url: '/', icon: Cat },
  { label: 'Items', url: '/item', icon: Backpack },
  { label: 'Moves', url: '/move', icon: Swords },
  { label: 'Abilities', url: '/ability', icon: Accessibility },
  // { label: 'Types', url: '/type' },
  // { label: 'Egg Groups', url: '/egg-group' },
  // { label: 'Damage Classes', url: '/damage-class' },
]

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const isActiveRoute = (url: string) => {
    if (url === '/') {
      return (
        pathname === '/' ||
        (pathname.startsWith('/') &&
          !navigation.slice(1).some((item) => pathname.startsWith(item.url)))
      )
    }

    return pathname.startsWith(url)
  }

  return (
    <>
      <Dialog
        open={sidebarOpen}
        onClose={setSidebarOpen}
        className="relative z-50 lg:hidden"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-zinc-900/80 transition-opacity duration-300 ease-linear data-closed:opacity-0"
        />

        <div className="fixed inset-0 flex">
          <DialogPanel
            transition
            className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-closed:-translate-x-full"
          >
            <TransitionChild>
              <div className="absolute top-0 left-full flex w-16 justify-center pt-5 duration-300 ease-in-out data-closed:opacity-0">
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="-m-2.5 p-2.5"
                >
                  <span className="sr-only">Close sidebar</span>
                  <X aria-hidden="true" className="size-6 text-white" />
                </button>
              </div>
            </TransitionChild>
            {/* Sidebar component, swap this element with another sidebar if you like */}
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-zinc-900 px-6 pb-2 ring-1 ring-white/10">
              <div className="flex h-16 shrink-0 items-center">
                <img
                  alt="Your Company"
                  src="https://tailwindui.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                  className="h-8 w-auto"
                />
              </div>
              <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul role="list" className="-mx-2 space-y-1">
                      {navigation.map((item) => {
                        const active = isActiveRoute(item.url)
                        return (
                          <li key={item.label}>
                            <Link
                              href={item.url}
                              className={clsx(
                                active
                                  ? 'bg-zinc-800 text-white'
                                  : 'text-gray-400 hover:bg-zinc-800 hover:text-white',
                                'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold'
                              )}
                            >
                              <item.icon
                                aria-hidden="true"
                                className="size-6 shrink-0"
                              />
                              {item.label}
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  </li>
                </ul>
              </nav>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-56 lg:flex-col">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-zinc-900 px-6">
          <div className="flex h-16 shrink-0 items-center">
            <img
              alt="Your Company"
              src="https://tailwindui.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
              className="h-8 w-auto"
            />
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const active = isActiveRoute(item.url)
                    return (
                      <li key={item.label}>
                        <Link
                          href={item.url}
                          className={clsx(
                            active
                              ? 'bg-zinc-800 text-white'
                              : 'text-gray-400 hover:bg-zinc-800 hover:text-white',
                            'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold'
                          )}
                        >
                          <item.icon
                            aria-hidden="true"
                            className="size-6 shrink-0"
                          />
                          {item.label}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-zinc-900 px-4 py-4 shadow-xs sm:px-6 lg:hidden">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="-m-2.5 p-2.5 text-gray-400 lg:hidden"
        >
          <span className="sr-only">Open sidebar</span>
          <Menu aria-hidden="true" className="size-6" />
        </button>
        <div className="flex-1 text-sm/6 font-semibold text-white">
          Dashboard
        </div>
        <div className="flex gap-x-6">
          <GlobalIndexSearch />
          <ThemeSwitch />
        </div>
      </div>
    </>
  )
}
