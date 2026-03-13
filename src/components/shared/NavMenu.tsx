import { useEffect, useState, memo, lazy, Suspense } from 'react'
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

const ThemeSwitch = lazy(() => import('@/components/shared/ThemeSwitch'))

const navItems = [
  { label: 'Pokemon', url: '/', icon: Cat },
  { label: 'Items', url: '/item', icon: Backpack },
  { label: 'Moves', url: '/move', icon: Swords },
  { label: 'Abilities', url: '/ability', icon: Shield },
]

function NavMenu({ variant }: { variant: 'navbar' | 'sidebar' }) {
  const [pathname, setPathname] = useState('/')

  useEffect(() => {
    setPathname(window.location.pathname)
  }, [])

  const basePath = import.meta.env.PUBLIC_BASEPATH || ''

  const isActiveRoute = (url: string) => {
    const fullUrl = basePath + url
    if (url === '/') {
      return (
        pathname === '/' ||
        pathname === basePath ||
        pathname === `${basePath}/` ||
        !navItems.some(
          (item) => item.url !== '/' && pathname.startsWith(basePath + item.url)
        )
      )
    }
    return pathname.startsWith(fullUrl)
  }

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
          <Suspense>
            <ThemeSwitch />
          </Suspense>
        </NavbarSection>
      </>
    )
  }

  return (
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
        <Suspense>
          <ThemeSwitch />
        </Suspense>
      </SidebarSection>
    </SidebarBody>
  )
}

export default memo(NavMenu)
