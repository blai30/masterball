import Footer from '@/components/shared/Footer'
import Shell from '@/components/shared/Shell'
import { VersionGroupProvider } from '@/components/shared/VersionGroupProvider'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <VersionGroupProvider>
      <div className="flex min-h-screen flex-col gap-6">
        <Shell />
        <main className="flex grow flex-col items-center">{children}</main>
        <Footer />
      </div>
    </VersionGroupProvider>
  )
}
