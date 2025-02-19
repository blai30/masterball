import Image from 'next/image'
import Link from 'next/link'
import { Pokemon, PokemonSpecies } from 'pokedex-promise-v2'
import { pokeapi } from '@/lib/providers'
import { getTranslation, TypeName } from '@/lib/utils/pokeapiHelpers'
import GlassCard from '@/components/GlassCard'
import TypePill from '@/components/TypePill'

export default async function MonsterPill({
  species,
}: {
  species: PokemonSpecies
}) {
  const pokemon: Pokemon = await pokeapi.getPokemonByName(
    species.varieties.find((variety) => variety.is_default)!.pokemon.name
  )
  const types = await pokeapi.getTypeByName(
    pokemon.types.map((type) => type.type.name)
  )

  const name = getTranslation(species.names, 'name')
  const imageId = species.id.toString().padStart(4, '0')
  const imageUrl = `https://resource.pokemon-home.com/battledata/img/pokei128/icon${imageId}_f00_s0.png`

  return (
    <GlassCard variant="link" className="rounded-lg">
      <Link
        href={`/${species.name}`}
        className="group flex w-56 items-center gap-3 px-3 py-2"
      >
        <Image
          src={imageUrl}
          alt={species.name}
          width={64}
          height={64}
          priority
          className="w-16 object-contain py-1"
        />
        <div className="flex h-full w-full flex-col justify-between gap-1">
          <h3 className="rounded-xs text-lg font-medium text-zinc-700 dark:text-zinc-300">
            {name}
          </h3>
          <div className="flex flex-row gap-2">
            {types.map((typeResource) => (
              <TypePill
                key={typeResource.id}
                variant={typeResource.name as TypeName}
                size="small"
                link={false}
              />
            ))}
          </div>
        </div>
      </Link>
    </GlassCard>
  )
}
