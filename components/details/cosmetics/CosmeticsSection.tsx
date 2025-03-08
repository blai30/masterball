import Image from 'next/image'
import clsx from 'clsx'
import { Pokemon, PokemonForm } from 'pokedex-promise-v2'
import { getTranslation } from '@/lib/utils/pokeapiHelpers'

export default async function CosmeticsSection({
  pokemon,
  forms,
}: {
  pokemon: Pokemon
  forms: PokemonForm[]
}) {
  const title = 'Cosmetic Forms'

  return (
    <section className="flex flex-col gap-4 rounded-xl p-4 inset-ring-1 inset-ring-zinc-200 dark:inset-ring-zinc-800">
      <h2 className="text-xl font-medium text-black dark:text-white">
        {title}
      </h2>
      {!forms || forms.length === 0 ? (
        <p className="flex items-baseline gap-2">
          <span className="text-lg text-pretty text-zinc-700 dark:text-zinc-300">
            No cosmetic forms available for this Pokémon.
          </span>
        </p>
      ) : (
        <ul className="flex flex-wrap gap-4">
          {forms.map((form) => {
            const name = getTranslation(form.form_names, 'name')!

            return (
              <li
                key={form.name}
                className={clsx(
                  'flex w-44 flex-col items-center gap-2',
                  // 'inset-ring-1 inset-ring-zinc-200 dark:inset-ring-zinc-800',
                  'rounded-lg p-2'
                )}
              >
                <span title={name} className="text-sm">
                  {name}
                </span>
                <Image
                  src={
                    form.sprites.front_default || pokemon.sprites.front_default!
                  }
                  alt={name}
                  width={100}
                  height={100}
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
