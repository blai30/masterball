'use client'

import { useLanguage } from '@/lib/LanguageContext'
import { getTranslation } from '@/lib/utils/pokeapiHelpers'

interface BaseTranslatable {
  language: {
    name: string
  }
}

export default function TranslatedText<
  T extends BaseTranslatable,
  K extends keyof T,
>({ resources, field }: { resources: T[]; field: K }) {
  const { language } = useLanguage()
  const content = getTranslation(resources, field, language)
  return <>{content}</>
}
