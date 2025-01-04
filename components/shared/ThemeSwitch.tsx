'use client'

import { useTheme } from 'next-themes'

export default function ThemeSwitch() {
  const { theme, setTheme } = useTheme()

  return (
    <select
      id="theme-switch"
      name="Theme switch"
      title="Theme switch"
      value={theme}
      onChange={(e) => setTheme(e.target.value)}
      className="bg-zinc-200 text-black dark:bg-zinc-800 dark:text-white"
    >
      <option value="system">System</option>
      <option value="dark">Dark</option>
      <option value="light">Light</option>
    </select>
  )
}
