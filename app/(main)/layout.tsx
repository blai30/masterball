import Footer from '@/components/shared/Footer'
import Header from '@/components/shared/Header'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-screen flex-col gap-6">
      {/* <Sidebar />
      <main className="py-10 lg:pl-56">
        <div className="px-4 sm:px-6 lg:px-8">{children}</div>
      </main> */}
      <Header />
      <main className="flex grow flex-col items-center px-4">{children}</main>
      <Footer />
    </div>
  )
}
