import type { Metadata, Viewport } from 'next'
import './globals.css'
import clsx from 'clsx/lite'
import { ThemeProvider } from 'next-themes'
import { Analytics } from '@vercel/analytics/react'

// Font loading optimized for static builds
let geist: any, inter: any, jetBrainsMono: any, sofiaSans: any

if (process.env.NODE_ENV === 'development') {
  // Only load Google Fonts during development
  const { Geist, Inter, JetBrains_Mono, Sofia_Sans } = require('next/font/google')
  
  geist = Geist({
    variable: '--font-geist',
    subsets: ['latin'],
    display: 'swap',
  })

  inter = Inter({
    variable: '--font-inter',
    subsets: ['latin'],
    display: 'swap',
  })

  jetBrainsMono = JetBrains_Mono({
    variable: '--font-jetbrains-mono',
    subsets: ['latin'],
    display: 'swap',
  })

  sofiaSans = Sofia_Sans({
    variable: '--font-sofia-sans',
    subsets: ['latin'],
    display: 'swap',
  })
} else {
  // Use fallback font configuration for production builds
  geist = { variable: '--font-geist' }
  inter = { variable: '--font-inter' }
  jetBrainsMono = { variable: '--font-jetbrains-mono' }
  sofiaSans = { variable: '--font-sofia-sans' }
}

export const metadata: Metadata = {
  title: {
    template: '%s',
    default: 'Masterball',
  },
  description:
    'Statically rendered and hosted web app for a modern Pokémon database.',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_FULL_URL || 'http://localhost:3000'
  ),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Masterball',
    url: process.env.NEXT_PUBLIC_FULL_URL,
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASEPATH}/favicon.png`,
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

export const dynamicParams = false
export const fetchCache = 'only-cache'

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
        'h-full bg-white scheme-light lg:bg-zinc-100 dark:bg-zinc-950 dark:scheme-dark dark:lg:bg-black',
        geist.variable,
        inter.variable,
        jetBrainsMono.variable,
        sofiaSans.variable
      )}
    >
      {process?.env?.NODE_ENV && process?.env?.NODE_ENV === 'development' && (
        <head>
          <script src="https://unpkg.com/react-scan/dist/auto.global.js"></script>
        </head>
      )}
      <body className="h-full text-black antialiased dark:text-white">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
