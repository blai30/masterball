import Header from '@/components/shared/Header'
import Footer from '@/components/shared/Footer'

export const dynamic = 'force-static'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-screen flex-col gap-6">
      {/* <Suspense>
          <Shell />
        </Suspense> */}
      <Header />
      <main className="flex grow flex-col items-center">{children}</main>
      <Footer />
    </div>
  )
}
