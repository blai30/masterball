import Footer from '@/components/shared/Footer'
import Shell from '@/components/shared/Shell'

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
      <Shell />
      <main className="flex grow flex-col items-center">{children}</main>
      <Footer />
    </div>
  )
}
