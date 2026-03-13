import { useState, useEffect } from 'react'
import clsx from 'clsx/lite'
import { Monitor, Moon, Sun } from 'lucide-react'
import { Radio, RadioGroup } from '@headlessui/react'

const options = [
  {
    value: 'system',
    label: 'System theme',
    icon: <Monitor size={20} />,
  },
  {
    value: 'light',
    label: 'Light theme',
    icon: <Sun size={20} />,
  },
  {
    value: 'dark',
    label: 'Dark theme',
    icon: <Moon size={20} />,
  },
]

export default function ThemeSwitch() {
  const [theme, setThemeState] = useState<string>('system')

  useEffect(() => {
    const stored = localStorage.getItem('theme') || 'system'
    setThemeState(stored)
  }, [])

  const applyTheme = (value: string) => {
    const isDark =
      value === 'dark' ||
      (value === 'system' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    document.documentElement.classList.toggle('dark', isDark)
  }

  const handleThemeChange = (value: string) => {
    setThemeState(value)
    localStorage.setItem('theme', value)
    if (!document.startViewTransition) {
      applyTheme(value)
      return
    }
    document.startViewTransition(() => applyTheme(value))
  }

  return (
    <RadioGroup
      value={theme}
      onChange={handleThemeChange}
      title="Theme switch"
      className="relative isolate flex flex-row items-center gap-0.5 rounded-full bg-zinc-100 p-0.75 lg:bg-white dark:bg-black dark:lg:bg-zinc-900"
    >
      <span
        aria-hidden="true"
        className={clsx(
          'pointer-events-none absolute z-10 size-8 items-center justify-center rounded-full backdrop-invert-100 lg:size-7',
          theme === 'system' && 'translate-x-0',
          theme === 'light' && 'translate-x-8.5 lg:translate-x-7.5',
          theme === 'dark' && 'translate-x-17 lg:translate-x-15'
        )}
      />
      {options.map((option) => (
        <Radio
          key={option.value}
          value={option.value}
          title={option.label}
          aria-label={option.label}
          aria-description={`Change theme to ${option.label}`}
          className="group relative flex size-8 cursor-default items-center justify-center rounded-full p-1 text-black transition-shadow hover:inset-ring-2 hover:inset-ring-black hover:duration-0 data-checked:inset-ring-0 lg:size-7 dark:text-white dark:hover:inset-ring-white"
        >
          {option.icon}
        </Radio>
      ))}
    </RadioGroup>
  )
}
