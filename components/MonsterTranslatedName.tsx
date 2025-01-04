'use client'

import { Name } from 'pokedex-promise-v2'
import { useLanguage } from '@/lib/LanguageContext'

export default function MonsterTranslatedName({ names }: { names: Name[] }) {
  const { language } = useLanguage()
  const name = (
    names.find((nameResource) => nameResource.language.name === language) ??
    names.find((nameResource) => nameResource.language.name === 'en')!
  ).name

  return <>{name}</>
}
