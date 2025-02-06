import type { Metadata, Viewport } from 'next'
import { Geist, Inter, JetBrains_Mono, Sofia_Sans } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import clsx from 'clsx/lite'
import { ThemeProvider } from 'next-themes'
import Header from '@/components/shared/Header'

const geist = Geist({
  variable: '--font-geist',
  subsets: ['latin'],
  display: 'swap',
})

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

const jetBrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  display: 'swap',
})

const sofiaSans = Sofia_Sans({
  variable: '--font-sofia-sans',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    template: '%s',
    default: 'Masterball',
  },
  description:
    'Statically rendered and hosted web app for a modern Pokémon database.',
  openGraph: {
    title: 'Masterball',
    type: 'website',
    locale: 'en_US',
    url: 'https://blai30.github.io/masterball/',
    images: [
      {
        url: 'https://blai30.github.io/masterball/favicon.png',
        width: 128,
        height: 128,
        alt: 'Masterball',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Masterball',
  },
  authors: [
    {
      name: 'blai30',
      url: 'https://github.com/blai30',
    },
  ],
  generator: 'Next.js',
  // prettier-ignore
  keywords: ['Next.js', 'React', 'JavaScript', 'TypeScript', 'Tailwind CSS', 'Pokémon', 'PokeAPI', 'Pokédex', 'Pokemon', 'Pokedex', 'Masterball', 'Database', 'Static', 'Web App', 'JSX', 'SSG', 'API', 'REST', 'Node', 'Node.js', 'Monster', 'Pocket Monsters', 'GitHub', 'Pages'],
  creator: 'blai30',
  publisher: 'blai30',
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#A25C7E',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Font applied in globals.css.
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={clsx(
        'scheme-light dark:scheme-dark',
        geist.variable,
        inter.variable,
        jetBrainsMono.variable,
        sofiaSans.variable
      )}
    >
      <head>
        <Script src="https://unpkg.com/react-scan/dist/auto.global.js"></Script>
      </head>
      <body className="bg-white text-black antialiased dark:bg-black dark:text-white">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col gap-6 px-4 py-6 print:mx-0 print:max-w-none print:p-0">
            <Header />
            <main className="flex grow flex-col items-center">{children}</main>
            {/* <Footer /> */}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
