'use client'

import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import { memo } from 'react'
import { Backpack, Cat, Shield, Swords } from 'lucide-react'
import VersionGroupSelector from '@/components/shared/VersionGroupSelector'
import { NavbarItem, NavbarSection, NavbarSpacer } from '@/components/ui/navbar'

const ThemeSwitch = dynamic(() => import('@/components/shared/ThemeSwitch'), {
  ssr: false,
})

const navItems = [
  { label: 'Pokemon', url: '/', icon: Cat },
  { label: 'Items', url: '/item', icon: Backpack },
  { label: 'Moves', url: '/move', icon: Swords },
  { label: 'Abilities', url: '/ability', icon: Shield },
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
    <>
      <NavbarSection className="max-lg:hidden">
        {navItems.map((item) => {
          const active = isActiveRoute(item.url)

          return (
            <NavbarItem
              key={item.url}
              href={item.url}
              current={active}
              className=""
            >
              <item.icon size={20} />
              <span>{item.label}</span>
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

export default memo(Header)
