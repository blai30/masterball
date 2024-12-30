'use client'

import ThemeSwitch from '@/components/shared/ThemeSwitch'

export default function Header() {
  return (
    <header className="flex flex-row gap-4">
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
