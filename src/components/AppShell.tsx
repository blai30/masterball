import type React from 'react'
import { StackedLayout } from '@/components/ui/catalyst/stacked-layout'
import { Sidebar } from '@/components/ui/catalyst/sidebar'
import { Navbar } from '@/components/ui/catalyst/navbar'
import NavMenu from '@/components/shared/NavMenu'
import Footer from '@/components/shared/Footer'

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <StackedLayout
        navbar={
          <Navbar className="@container mx-auto max-w-[96rem]">
            <NavMenu variant="navbar" />
          </Navbar>
        }
        sidebar={
          <Sidebar>
            <NavMenu variant="sidebar" />
          </Sidebar>
        }
      >
        {children}
      </StackedLayout>
      <Footer />
    </>
  )
}
