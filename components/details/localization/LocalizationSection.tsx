import clsx from 'clsx'
import { PokemonSpecies } from 'pokedex-promise-v2'

export default async function LocalizationSection({
  species,
}: {
  species: PokemonSpecies
}) {
  const title = 'Localization'

  return (
    <section className="flex flex-col gap-4 rounded-xl p-4 inset-ring-1 inset-ring-zinc-200 dark:inset-ring-zinc-800">
      <h2 className="text-xl font-medium text-black dark:text-white">
        {title}
      </h2>
      <ul className="flex flex-col gap-4">
        {species.names
          .toSorted((a, b) => a.language.name.localeCompare(b.language.name))
          .map((name) => {
            const { language, name: localizedName } = name

            return (
              <li
                key={language.name}
                className={clsx('flex flex-row items-center gap-4')}
              >
                <span
                  title={language.name}
                  className="w-20 text-right font-medium"
                >
                  {language.name}
                </span>
                <span className="text-zinc-700 dark:text-zinc-300">
                  {localizedName}
                </span>
              </li>
            )
          })}
      </ul>
    </section>
  )
}
