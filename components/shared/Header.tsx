'use client'

import ThemeSwitch from '@/components/ThemeSwitch'

export default function Header() {
  return (
    <header className="flex flex-row gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="language" className="text-black dark:text-white">
          Language
        </label>
        <select id="language" name="language" className="text-black dark:text-white bg-zinc-200 dark:bg-zinc-800">
          <option value="en">en</option>
        </select>
      </div>
      <ThemeSwitch />
    </header>
  )
}
