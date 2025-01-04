'use client'

import Link from 'next/link'
import LanguageSwitcher from '@/components/shared/LanguageSwitcher'
import ThemeSwitch from '@/components/shared/ThemeSwitch'

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
