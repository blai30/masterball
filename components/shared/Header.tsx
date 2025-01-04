'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'

const LanguageSwitcher = dynamic(
  () => import('@/components/shared/LanguageSwitcher'),
  { ssr: false }
)
const ThemeSwitch = dynamic(() => import('@/components/shared/ThemeSwitch'), {
  ssr: false,
})

export default function Header() {
  return (
    <header className="flex flex-row gap-4">
      <Link href="/" className="text-blue-700 underline dark:text-blue-300">
        <p>Home</p>
      </Link>
      <LanguageSwitcher />
      <ThemeSwitch />
    </header>
  )
}
