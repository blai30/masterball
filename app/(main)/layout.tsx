import Header from '@/components/shared/Header'
import Footer from '@/components/shared/Footer'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-screen flex-col gap-6">
      <Header />
      <main className="flex grow flex-col items-center">{children}</main>
      <Footer />
    </div>
  )
}
