'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/lib/LanguageContext'

export default function LanguageSwitcher() {
  const [mounted, setMounted] = useState(false)
  const { language, setLanguage } = useLanguage()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <select
      id="language"
      name="Language switcher"
      title="Language switcher"
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
      className="bg-zinc-200 text-black dark:bg-zinc-800 dark:text-white"
    >
      <option value="en">English</option>
      <option value="ja">Japanese</option>
    </select>
  )
}
