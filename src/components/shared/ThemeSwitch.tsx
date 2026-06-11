import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

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
  // Drives the directional label only. Undefined until mounted so the first client
  // render matches the SSR markup; the visible icon is handled purely by CSS off the
  // `dark` class that the inline script in Layout.astro applies before paint.
  const [isDark, setIsDark] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [])

  const handleToggle = () => {
    const next: ThemeValue = document.documentElement.classList.contains('dark') ? 'light' : 'dark'
    setIsDark(next === 'dark')

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

  const label =
    isDark === undefined
      ? 'Toggle theme'
      : isDark
        ? 'Switch to light theme'
        : 'Switch to dark theme'

  return (
    <button
      onClick={handleToggle}
      title={label}
      aria-label={label}
      className="flex cursor-default items-center justify-center rounded-lg p-2 text-black transition-colors hover:bg-zinc-950/10 hover:duration-0 dark:text-white dark:hover:bg-white/10"
    >
      <Moon size={20} className="hidden dark:block" />
      <Sun size={20} className="block dark:hidden" />
    </button>
  )
}
