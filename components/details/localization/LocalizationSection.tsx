import type { PokemonSpecies } from 'pokedex-promise-v2'

export default async function LocalizationSection({
  species,
}: {
  species: PokemonSpecies
}) {
  const title = 'Localization'

  return (
    <section className="@container flex flex-col gap-4 rounded-xl p-4 inset-ring-1 inset-ring-zinc-200 dark:inset-ring-zinc-800">
      <h2 className="text-xl font-medium text-black dark:text-white">
        {title}
      </h2>
      <ul className="grid max-w-lg grid-flow-col grid-cols-1 grid-rows-11 gap-2 @md:grid-cols-2 @md:grid-rows-6">
        {species.names
          .toSorted((a, b) => a.language.name.localeCompare(b.language.name))
          .map((name) => {
            const { language, name: localizedName } = name
            return (
              <li
                key={language.name}
                className="flex w-full flex-col items-center"
              >
                <p className="flex w-full items-center gap-3">
                  <span
                    title={language.name}
                    className="w-1/3 text-right font-medium"
                  >
                    {language.name}
                  </span>
                  <span className="text-zinc-700 dark:text-zinc-300">
                    {localizedName}
                  </span>
                </p>
              </li>
            )
          })}
      </ul>
    </section>
  )
}
