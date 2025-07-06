import Image from 'next/image'
import clsx from 'clsx'
import type { Pokemon, PokemonForm } from 'pokedex-promise-v2'
import { getTranslation } from '@/lib/utils/pokeapiHelpers'

export default async function CosmeticsSection({
  pokemon,
  forms,
}: {
  pokemon: Pokemon
  forms: PokemonForm[]
}) {
  const title = 'Cosmetic forms'
  const cosmeticForms = forms.filter((form) => form.name !== pokemon.name)

  return (
    <section className="@container flex flex-col gap-4 rounded-xl p-4 inset-ring-1 inset-ring-zinc-200 dark:inset-ring-zinc-800">
      <h2 className="text-xl font-medium text-black dark:text-white">
        {title}
      </h2>
      {!cosmeticForms || cosmeticForms.length === 0 ? (
        <p className="flex items-baseline gap-2">
          <span className="text-lg text-pretty text-zinc-700 dark:text-zinc-300">
            No cosmetic forms available for this Pokémon.
          </span>
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-4 @sm:grid-cols-2 @lg:grid-cols-3 @xl:grid-cols-4 @4xl:grid-cols-6">
          {cosmeticForms.map(async (form) => {
            const name = getTranslation(form.form_names, 'name')!
            const imageId = pokemon.id.toString().padStart(4, '0')
            const imageUrl = form.is_default
              ? `https://raw.githubusercontent.com/blai30/PokemonSpritesDump/refs/heads/main/sprites/sprite_${imageId}_s0.webp`
              : `https://raw.githubusercontent.com/blai30/PokemonSpritesDump/refs/heads/main/sprites/sprite_${imageId}_${form.name}_s0.webp`

            return (
              <li
                key={form.name}
                className={clsx(
                  'flex flex-col items-center gap-2',
                  // 'inset-ring-1 inset-ring-zinc-200 dark:inset-ring-zinc-800',
                  'bg-gradient-to-br from-white to-zinc-100 dark:from-zinc-900 dark:to-zinc-950',
                  'rounded-lg p-4'
                )}
              >
                <span title={name} className="text-sm">
                  {name}
                </span>
                <Image
                  src={imageUrl}
                  alt={name}
                  width={128}
                  height={128}
                  className="object-contain"
                />
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
