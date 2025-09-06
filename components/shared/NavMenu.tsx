'use client'

import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import { memo } from 'react'
import { Backpack, Cat, Shield, Swords } from 'lucide-react'
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

const ThemeSwitch = dynamic(() => import('@/components/shared/ThemeSwitch'), {
  ssr: false,
})

const navItems = [
  { label: 'Pokemon', url: '/', icon: Cat },
  { label: 'Items', url: '/item', icon: Backpack },
  { label: 'Moves', url: '/move', icon: Swords },
  { label: 'Abilities', url: '/ability', icon: Shield },
]

function NavMenu({ variant }: { variant: 'navbar' | 'sidebar' }) {
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

  // Navbar variant for desktop
  if (variant === 'navbar') {
    return (
      <>
        <NavbarSection className="max-lg:hidden">
          {navItems.map((item) => {
            const active = isActiveRoute(item.url)
            return (
              <NavbarItem key={item.url} href={item.url} current={active}>
                <item.icon size={20} />
                <NavbarLabel>{item.label}</NavbarLabel>
              </NavbarItem>
            )
          })}
        </NavbarSection>
        <NavbarSpacer />
        <NavbarSection className="max-lg:hidden">
          <VersionGroupSelector />
          <ThemeSwitch />
        </NavbarSection>
      </>
    )
  }

  // Sidebar variant for mobile
  return (
    <>
      <SidebarBody>
        <SidebarSection>
          {navItems.map((item) => {
            const active = isActiveRoute(item.url)
            return (
              <SidebarItem key={item.url} href={item.url} current={active}>
                <item.icon size={20} />
                <SidebarLabel>{item.label}</SidebarLabel>
              </SidebarItem>
            )
          })}
        </SidebarSection>
        <SidebarDivider />
        <SidebarSection className="flex items-start gap-3">
          <VersionGroupSelector />
          <ThemeSwitch />
        </SidebarSection>
      </SidebarBody>
    </>
  )
}

export default memo(NavMenu)
