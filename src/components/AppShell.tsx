import Footer from '@/components/shared/Footer'
import NavMenu from '@/components/shared/NavMenu'
import { Navbar } from '@/components/ui/catalyst/navbar'
import { Sidebar } from '@/components/ui/catalyst/sidebar'
import { StackedLayout } from '@/components/ui/catalyst/stacked-layout'

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
