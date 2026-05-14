import type { Pokemon, PokemonSpecies } from 'pokedex-promise-v2'

import GlassCard from '@/components/GlassCard'
import TypeIcon from '@/components/TypeIcon'
import Link from '@/components/ui/catalyst/link'
import { getTranslation, type TypeKey } from '@/lib/utils/pokeapi-helpers'

export default function MonsterPill({
  species,
  pokemon,
}: {
  species: PokemonSpecies
  pokemon: Pokemon
}) {
  const name = getTranslation(species.names, 'name')
  const imageId = species.id.toString().padStart(4, '0')
  const imageUrl = `https://raw.githubusercontent.com/blai30/PokemonSpritesDump/refs/heads/main/sprites/sprite_${imageId}_s0.webp`

  return (
    <GlassCard variant="link" className="rounded-lg">
      <Link href={`${import.meta.env.BASE_URL}${species.name}`} className="group flex w-56 items-center gap-3 px-3 py-2">
        <img
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
              <TypeIcon key={type.type.name} variant={type.type.name as TypeKey} size="small" />
            ))}
          </div>
        </div>
      </Link>
    </GlassCard>
  )
}
