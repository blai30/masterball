import { StackedLayout } from '@/components/ui/catalyst/stacked-layout'
import { Sidebar } from '@/components/ui/catalyst/sidebar'
import { Navbar } from '@/components/ui/catalyst/navbar'
import NavMenu from '@/components/shared/NavMenu'
import Footer from '@/components/shared/Footer'

export const dynamicParams = false
export const fetchCache = 'only-cache'

export default function RootLayout(props: LayoutProps<'/'>) {
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
        {props.children}
      </StackedLayout>
      <Footer />
    </>
  )
}
