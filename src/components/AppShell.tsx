import { StackedLayout } from '@/components/ui/catalyst/stacked-layout'
import { Sidebar } from '@/components/ui/catalyst/sidebar'
import { Navbar } from '@/components/ui/catalyst/navbar'
import NavMenu from '@/components/shared/NavMenu'
import Footer from '@/components/shared/Footer'

export default function AppShell({
  pathname,
  children,
}: {
  pathname: string
  children: React.ReactNode
}) {
  return (
    <>
      <StackedLayout
        navbar={
          <Navbar className="@container mx-auto max-w-384">
            <NavMenu variant="navbar" pathname={pathname} />
          </Navbar>
        }
        sidebar={
          <Sidebar>
            <NavMenu variant="sidebar" pathname={pathname} />
          </Sidebar>
        }
      >
        {children}
      </StackedLayout>
      <Footer />
    </>
  )
}
