'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/components/LanguageContext'

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
    <div className="flex flex-col gap-2">
      <select
        id="language"
        name="language"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="bg-zinc-200 text-black dark:bg-zinc-800 dark:text-white"
      >
        <option value="en">English</option>
        <option value="ja">Japanese</option>
      </select>
    </div>
  )
}
