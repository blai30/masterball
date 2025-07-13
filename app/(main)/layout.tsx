import Header from '@/components/shared/Header'
import Footer from '@/components/shared/Footer'
import { StackedLayout } from '@/components/ui/stacked-layout'
import { Sidebar } from '@/components/ui/sidebar'
import { Navbar } from '@/components/ui/navbar'

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
          <Navbar>
            <Header />
          </Navbar>
        }
        sidebar={<Sidebar />}
      >
        {children}
      </StackedLayout>
      <Footer />
    </>
  )
}
