import * as Headless from '@headlessui/react'
import { Backpack, Cat, Shield, Swords } from 'lucide-react'
import { lazy, Suspense, useState } from 'react'

import VersionGroupSelector from '@/components/shared/VersionGroupSelector'
import { NavbarItem } from '@/components/ui/catalyst/navbar'
import {
  Sidebar,
  SidebarBody,
  SidebarDivider,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
} from '@/components/ui/catalyst/sidebar'
import { normalizePathname, toHref } from '@/lib/utils/path'

const ThemeSwitch = lazy(() => import('@/components/shared/ThemeSwitch'))

const navItems = [
  { label: 'Pokemon', url: '/', icon: Cat },
  { label: 'Items', url: '/item', icon: Backpack },
  { label: 'Moves', url: '/move', icon: Swords },
  { label: 'Abilities', url: '/ability', icon: Shield },
]

function OpenMenuIcon() {
  return (
    <svg data-slot="icon" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M2 6.75C2 6.33579 2.33579 6 2.75 6H17.25C17.6642 6 18 6.33579 18 6.75C18 7.16421 17.6642 7.5 17.25 7.5H2.75C2.33579 7.5 2 7.16421 2 6.75ZM2 13.25C2 12.8358 2.33579 12.5 2.75 12.5H17.25C17.6642 12.5 18 12.8358 18 13.25C18 13.6642 17.6642 14 17.25 14H2.75C2.33579 14 2 13.6642 2 13.25Z" />
    </svg>
  )
}

function CloseMenuIcon() {
  return (
    <svg data-slot="icon" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
    </svg>
  )
}

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
        <NavbarItem onClick={() => setShowSidebar(true)} aria-label="Open navigation">
          <OpenMenuIcon />
        </NavbarItem>
      </div>

      <Headless.Dialog
        open={showSidebar}
        onClose={() => setShowSidebar(false)}
        className="lg:hidden"
      >
        <Headless.DialogBackdrop
          transition
          className="fixed inset-0 bg-black/30 transition data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />
        <Headless.DialogPanel
          transition
          className="fixed inset-y-0 w-full max-w-80 p-2 transition duration-300 ease-in-out data-closed:-translate-x-full"
        >
          <div className="flex h-full flex-col rounded-lg bg-white shadow-xs ring-1 ring-zinc-950/5 dark:bg-zinc-900 dark:ring-white/10">
            <div className="-mb-3 px-4 pt-3">
              <Headless.CloseButton as={NavbarItem} aria-label="Close navigation">
                <CloseMenuIcon />
              </Headless.CloseButton>
            </div>
            <Sidebar>
              <SidebarBody>
                <SidebarSection>
                  {navItems.map((item) => {
                    const active = isActiveRoute(item.url)
                    return (
                      <SidebarItem key={item.url} href={toHref(item.url)} current={active}>
                        <item.icon size={20} />
                        <SidebarLabel>{item.label}</SidebarLabel>
                      </SidebarItem>
                    )
                  })}
                </SidebarSection>
                <SidebarDivider />
                <SidebarSection className="flex items-start gap-3">
                  <VersionGroupSelector />
                  <Suspense fallback={null}>
                    <ThemeSwitch />
                  </Suspense>
                </SidebarSection>
              </SidebarBody>
            </Sidebar>
          </div>
        </Headless.DialogPanel>
      </Headless.Dialog>
    </>
  )
}
