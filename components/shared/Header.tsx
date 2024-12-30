'use client'

import Link from 'next/link'
import ThemeSwitch from '@/components/shared/ThemeSwitch'

export default function Header() {
  return (
    <header className="flex flex-row gap-4">
      <Link href="/" className="text-blue-700 underline dark:text-blue-300">
        <p>Home</p>
      </Link>
      <div className="flex flex-col gap-2">
        <select
          id="language"
          name="language"
          className="bg-zinc-200 text-black dark:bg-zinc-800 dark:text-white"
        >
          <option value="en">English</option>
        </select>
      </div>
      <ThemeSwitch />
    </header>
  )
}
