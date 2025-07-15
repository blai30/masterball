import { StackedLayout } from '@/components/ui/stacked-layout'
import { Sidebar } from '@/components/ui/sidebar'
import { Navbar } from '@/components/ui/navbar'
import NavMenu from '@/components/shared/NavMenu'
import Footer from '@/components/shared/Footer'

export const dynamicParams = false
export const fetchCache = 'only-cache'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // return (
  //   <div className="flex min-h-screen flex-col gap-6">
  //     <Header />
  //     <main className="flex grow flex-col items-center">{children}</main>
  //     <Footer />
  //   </div>
  // )
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
