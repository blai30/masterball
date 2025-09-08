import type { Route } from 'next'
import Image from 'next/image'
import Link from '@/components/ui/catalyst/link'
import type { Pokemon, PokemonSpecies } from 'pokedex-promise-v2'
import { getTranslation, type TypeKey } from '@/lib/utils/pokeapi-helpers'
import { excludedVariants } from '@/lib/utils/excluded-slugs'
import GlassCard from '@/components/GlassCard'
import TypeIcon from '@/components/TypeIcon'

export default async function MonsterPill({
  species,
}: {
  species: PokemonSpecies
}) {
  const slug = species.varieties
    .filter((variant) => !excludedVariants.includes(variant.pokemon.name))
    .find((variety) => variety.is_default)!.pokemon.name
  const pokemon: Pokemon = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${slug}`
  ).then((response) => response.json() as Promise<Pokemon>)

  const name = getTranslation(species.names, 'name')
  const imageId = species.id.toString().padStart(4, '0')
  const imageUrl = `https://raw.githubusercontent.com/blai30/PokemonSpritesDump/refs/heads/main/sprites/sprite_${imageId}_s0.webp`

  return (
    <GlassCard variant="link" className="rounded-lg">
      <Link
        href={`/${species.name}` as Route}
        className="group flex w-56 items-center gap-3 px-3 py-2"
      >
        <Image
          src={imageUrl}
          alt={species.name}
          width={64}
          height={64}
          className="w-16 object-contain py-1"
        />
        <div className="flex h-full w-full flex-col justify-between gap-1">
          <h3 className="rounded-xs text-lg font-medium text-zinc-700 dark:text-zinc-300">
            {name}
          </h3>
          <div className="flex flex-row gap-1">
            {pokemon.types.map((type) => (
              <TypeIcon
                key={type.type.name}
                variant={type.type.name as TypeKey}
                size="small"
              />
            ))}
          </div>
        </div>
      </Link>
    </GlassCard>
  )
}
