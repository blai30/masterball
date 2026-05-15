import { Moon, Sun } from 'lucide-react'
import { useState, useEffect } from 'react'

type ThemeValue = 'light' | 'dark'

function getSystemTheme(): ThemeValue {
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

function applyTheme(theme: ThemeValue) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  if (theme === getSystemTheme()) {
    localStorage.removeItem('theme')
  } else {
    localStorage.setItem('theme', theme)
  }
}

export default function ThemeSwitch() {
  const [theme, setTheme] = useState<ThemeValue | undefined>(undefined)

  useEffect(() => {
    const stored = localStorage.getItem('theme')
    setTheme(stored === 'light' || stored === 'dark' ? stored : getSystemTheme())
  }, [])

  if (theme === undefined) return null

  const handleToggle = () => {
    const next: ThemeValue = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)

    const root = document.documentElement
    if (!document.startViewTransition) {
      applyTheme(next)
    } else {
      root.dataset.themeTransition = 'true'
      const transition = document.startViewTransition(() => applyTheme(next))
      transition.finished.finally(() => {
        delete root.dataset.themeTransition
      })
    }
  }

  return (
    <button
      onClick={handleToggle}
      title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      className="flex cursor-default items-center justify-center rounded-lg p-2 text-black transition-colors hover:bg-zinc-950/10 hover:duration-0 dark:text-white dark:hover:bg-white/10"
    >
      {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  )
}
