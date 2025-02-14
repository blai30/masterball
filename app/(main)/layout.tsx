import Footer from '@/components/shared/Footer'
import Header from '@/components/shared/Header'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Font applied in globals.css.
  return (
    <div className="flex min-h-screen flex-col gap-6 px-4 py-6 print:mx-0 print:max-w-none print:p-0">
      <Header />
      <main className="flex grow flex-col items-center">{children}</main>
      <Footer />
    </div>
  )
}
