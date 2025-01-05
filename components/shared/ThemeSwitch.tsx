'use client'

import { useTheme } from 'next-themes'

const options = [
  {
    value: 'system',
    label: 'System',
  },
  {
    value: 'dark',
    label: 'Dark',
  },
  {
    value: 'light',
    label: 'Light',
  },
]

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
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
