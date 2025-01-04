'use client'

import { useLanguage } from '@/lib/LanguageContext'

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
      <option value="en">en</option>
      <option value="ja-Hrkt">ja-Hrkt</option>
      <option value="ja">ja</option>
      <option value="ko">ko</option>
      <option value="zh-Hant">zh-Hant</option>
      <option value="fr">fr</option>
      <option value="de">de</option>
      <option value="es">es</option>
      <option value="it">it</option>
      <option value="zh-Hans">zh-Hans</option>
    </select>
  )
}
