import { Backpack, Cat, Shield, Swords } from 'lucide-react'
import { lazy, memo, Suspense } from 'react'

import VersionGroupSelector from '@/components/shared/VersionGroupSelector'
import {
  NavbarItem,
  NavbarLabel,
  NavbarSection,
  NavbarSpacer,
} from '@/components/ui/catalyst/navbar'
import {
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

function NavMenu({ variant, pathname }: { variant: 'navbar' | 'sidebar'; pathname: string }) {
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

  // Navbar variant for desktop
  if (variant === 'navbar') {
    return (
      <>
        <NavbarSection className="max-lg:hidden">
          {navItems.map((item) => {
            const active = isActiveRoute(item.url)
            return (
              <NavbarItem key={item.url} href={toHref(item.url)} current={active}>
                <item.icon size={20} />
                <NavbarLabel>{item.label}</NavbarLabel>
              </NavbarItem>
            )
          })}
        </NavbarSection>
        <NavbarSpacer />
        <NavbarSection className="max-lg:hidden">
          <VersionGroupSelector />
          <Suspense fallback={null}>
            <ThemeSwitch />
          </Suspense>
        </NavbarSection>
      </>
    )
  }

  // Sidebar variant for mobile
  return (
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
  )
}

export default memo(NavMenu)
