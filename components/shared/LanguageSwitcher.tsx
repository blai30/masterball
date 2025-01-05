'use client'

import { useLanguage } from '@/lib/LanguageContext'

const options = [
  {
    value: 'en',
    label: 'English',
  },
  {
    value: 'ja-Hrkt',
    label: 'にほんご',
  },
  {
    value: 'ja',
    label: '日本語',
  },
  {
    value: 'ko',
    label: '한국인',
  },
  {
    value: 'zh-Hant',
    label: 'Chinese (Traditional)',
  },
  {
    value: 'fr',
    label: 'Francois',
  },
  {
    value: 'de',
    label: 'Deutsch',
  },
  {
    value: 'es',
    label: 'Espanol',
  },
  {
    value: 'it',
    label: 'Italian',
  },
  {
    value: 'zh-Hans',
    label: 'Chinese (Simplified)',
  },
]

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <select
      id="language"
      name="Language switcher"
      title="Language switcher"
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
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
