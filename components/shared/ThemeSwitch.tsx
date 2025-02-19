'use client'

import { useTheme } from 'next-themes'
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
  const { theme, setTheme } = useTheme()

  return (
    <RadioGroup
      value={theme}
      onChange={setTheme}
      title="Theme switch"
      className="relative z-0 inline-grid grid-cols-3 gap-0.5 rounded-full bg-white/50 p-0.75 text-zinc-950 dark:bg-black/50 dark:text-white"
    >
      {options.map((option) => (
        <Radio
          key={option.value}
          value={option.value}
          aria-label={option.label}
          className="group relative flex size-7 cursor-default items-center justify-center rounded-full p-1 transition-colors data-checked:bg-black data-checked:text-white dark:data-checked:bg-white dark:data-checked:text-black"
        >
          {option.icon}
        </Radio>
      ))}
    </RadioGroup>
  )
}
