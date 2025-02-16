'use client'

import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import {
  Navbar,
  NavbarItem,
  NavbarLabel,
  NavbarSection,
  NavbarSpacer,
} from '@/components/ui/navbar'
import {
  Sidebar,
  SidebarBody,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
} from '@/components/ui/sidebar'
import { StackedLayout } from '@/components/ui/stacked-layout'

const ThemeSwitch = dynamic(() => import('@/components/shared/ThemeSwitch'), {
  ssr: false,
})

const GlobalIndexSearch = dynamic(
  () => import('@/components/shared/GlobalIndexSearch'),
  {
    ssr: false,
  }
)

const navItems = [
  { label: 'Pokemon', url: '/' },
  { label: 'Items', url: '/item' },
  { label: 'Moves', url: '/move' },
  { label: 'Abilities', url: '/ability' },
  // { label: 'Types', url: '/type' },
  // { label: 'Egg Groups', url: '/egg-group' },
  // { label: 'Damage Classes', url: '/damage-class' },
]

export default function Navigation() {
  const pathname = usePathname()

  const isActiveRoute = (url: string) => {
    if (url === '/') {
      return (
        pathname === '/' ||
        (pathname.startsWith('/') &&
          !navItems.slice(1).some((item) => pathname.startsWith(item.url)))
      )
    }

    return pathname.startsWith(url)
  }

  return (
    <StackedLayout
      navbar={
        <Navbar className="">
          <NavbarSection className="max-lg:hidden">
            {navItems.map(({ label, url }) => {
              return (
                <NavbarItem key={label} href={url} current={isActiveRoute(url)}>
                  <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
                    />
                  </svg>
                  <NavbarLabel>{label}</NavbarLabel>
                </NavbarItem>
              )
            })}
          </NavbarSection>
          <NavbarSpacer />
          <NavbarSection>
            <GlobalIndexSearch />
            <ThemeSwitch />
          </NavbarSection>
        </Navbar>
      }
      sidebar={
        <Sidebar className="">
          <SidebarBody>
            <SidebarSection>
              {navItems.map(({ label, url }) => (
                <SidebarItem
                  key={label}
                  href={url}
                  current={isActiveRoute(url)}
                >
                  <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
                    />
                  </svg>
                  <SidebarLabel>{label}</SidebarLabel>
                </SidebarItem>
              ))}
            </SidebarSection>
            <SidebarSection>
              <GlobalIndexSearch />
              <ThemeSwitch />
            </SidebarSection>
          </SidebarBody>
        </Sidebar>
      }
    />
  )
}
