'use client'

import { useTheme } from 'next-themes'
import { motion } from 'motion/react'
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

  const handleThemeChange = (value: string) => {
    document.startViewTransition(() => setTheme(value))
  }

  return (
    <RadioGroup
      value={theme}
      onChange={handleThemeChange}
      title="Theme switch"
      className="relative inline-grid grid-cols-3 gap-0.5 rounded-full bg-white p-0.75 dark:bg-black"
    >
      {options.map((option) => {
        const current = theme === option.value

        return (
          <Radio
            key={option.value}
            value={option.value}
            title={option.label}
            aria-label={option.label}
            aria-description={`Change theme to ${option.label}`}
            className="group relative flex size-7 cursor-default items-center justify-center rounded-full p-1 text-black dark:text-white"
          >
            {option.icon}
            {current && (
              <motion.div
                layoutId="current-indicator"
                className="absolute inset-0 size-full rounded-full backdrop-invert-100"
              />
            )}
          </Radio>
        )
      })}
    </RadioGroup>
  )
}
