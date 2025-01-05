'use client'

import { useLanguage } from '@/lib/LanguageContext'
import { getTranslation } from '@/lib/utils/pokeapiHelpers'
import { PokemonSpecies } from 'pokedex-promise-v2'

export default function FlavorText({
  species,
}: Readonly<{ species: PokemonSpecies }>) {
  const { language } = useLanguage()
  const flavorText = getTranslation(
    species.flavor_text_entries,
    'flavor_text',
    language
  )

  return (
    <section className="px-4 py-6 sm:gap-4">
      <dt className="text-lg font-medium text-black dark:text-white">About</dt>
      <dd className="text-lg text-zinc-600 dark:text-zinc-400">
        {flavorText}
      </dd>
    </section>
  )
}
