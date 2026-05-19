import fs, { statSync, existsSync } from 'node:fs'
import path from 'node:path'

import pMap from 'p-map'
import type {
  Pokemon,
  PokemonSpecies,
  Move,
  Ability,
  Item,
  Machine,
  Type,
  LocationArea,
  Location,
  Version,
  EncounterMethod,
  PokemonEncounter,
  PokemonForm,
  EggGroup,
  GrowthRate,
  EvolutionChain,
} from 'pokedex-promise-v2'

import pokeapi from '../src/lib/api/pokeapi'
import { excludedItems, excludedVariants, excludedForms } from '../src/lib/utils/excluded-slugs'

const DATA_PATH = 'build/data.json'

export function shouldFetchData(): boolean {
  const dataPath = path.resolve('build/data.json')
  if (import.meta.env.DEV) return false
  if (!existsSync(dataPath)) return true
  const mtime = statSync(dataPath).mtimeMs
  const ageHours = (Date.now() - mtime) / (1000 * 60 * 60)
  if (ageHours > 24) {
    return true
  }
  console.log('Using cached data')
  return false
}

export async function fetchAndExportData() {
  const speciesList = await pokeapi.getList('pokemon-species', 1025)
  console.log(`Fetching ${speciesList.results.length} species details...`)
  const species = await pMap(
    speciesList.results,
    (specie) => pokeapi.getByName<PokemonSpecies>('pokemon-species', specie.name),
    {
      concurrency: 20,
    }
  )

  const pokemonUrls = new Set<string>()
  for (const specie of species) {
    const filtered = specie.varieties.filter((v) => !excludedVariants.includes(v.pokemon.name))
    for (const variant of filtered) {
      pokemonUrls.add(variant.pokemon.url)
    }
  }

  console.log(`Fetching ${pokemonUrls.size} Pokemon details...`)
  const pokemons = await pMap([...pokemonUrls], (url) => pokeapi.getResource<Pokemon>(url), {
    concurrency: 20,
  })

  const typeList = await pokeapi.getList('type', 30)
  console.log(`Fetching ${typeList.count} types...`)
  await pMap(typeList.results, (type) => pokeapi.getByName<Type>('type', type.name), {
    concurrency: 20,
  })

  const abilityList = await pokeapi.getList('ability', 600)
  console.log(`Fetching ${abilityList.count} abilities...`)
  await pMap(abilityList.results, (resource) => pokeapi.getResource<Ability>(resource.url), {
    concurrency: 20,
  })

  const moveList = await pokeapi.getList('move', 1200)
  console.log(`Fetching ${moveList.count} moves...`)
  const moveArr = await pMap(
    moveList.results,
    (resource) => pokeapi.getResource<Move>(resource.url),
    {
      concurrency: 20,
    }
  )

  const itemList = await pokeapi.getList('item', 10000)
  const filteredItems = itemList.results.filter(
    (resource) =>
      !excludedItems.includes(resource.name) && !resource.name.startsWith('dynamax-crystal-')
  )
  console.log(`Fetching ${filteredItems.length} items...`)
  await pMap(filteredItems, (resource) => pokeapi.getResource<Item>(resource.url), {
    concurrency: 20,
  })

  console.log('Fetching location encounters for all Pokemon...')
  await pMap(
    pokemons,
    async (pokemon) => {
      if (pokemon.location_area_encounters) {
        await pokeapi.getResource(pokemon.location_area_encounters)
      }
    },
    { concurrency: 20 }
  )

  console.log('Fetching species metadata...')
  await pMap(
    species,
    async (specie) => {
      if (specie.growth_rate.url) {
        await pokeapi.getResource<GrowthRate>(specie.growth_rate.url)
      }
      if (specie.egg_groups?.length) {
        await pMap(specie.egg_groups, (eggGroup) => pokeapi.getResource<EggGroup>(eggGroup.url), {
          concurrency: 4,
        })
      }
      if (specie.evolution_chain.url) {
        const chain = await pokeapi.getResource<EvolutionChain>(specie.evolution_chain.url)
        // Recursively collect species in evolution chains and fetch them
        const chainNode = (chain as any).chain
        if (chainNode) {
          const walk = (node: any): Promise<PokemonSpecies>[] => {
            const promises = [pokeapi.getResource<PokemonSpecies>(node.species.url)]
            for (const child of node.evolves_to || []) {
              promises.push(...walk(child))
            }
            return promises
          }
          await Promise.all(walk(chainNode))
        }
      }
    },
    { concurrency: 10 }
  )

  console.log('Fetching referenced Pokemon forms...')
  await pMap(
    pokemons,
    async (pokemon) => {
      if (pokemon.forms?.length) {
        const filtered = pokemon.forms.filter((form) => !excludedForms.includes(form.name))
        await pMap(filtered, (form) => pokeapi.getByName<PokemonForm>('pokemon-form', form.name), {
          concurrency: 20,
        })
      }
    },
    { concurrency: 20 }
  )

  console.log('Fetching machine data for moves...')
  const machineUrls = new Set<string>()
  for (const move of moveArr) {
    if (move.machines?.length) {
      for (const mach of move.machines) {
        machineUrls.add(mach.machine.url)
      }
    }
  }
  if (machineUrls.size > 0) {
    await pMap([...machineUrls], (url) => pokeapi.getResource<Machine>(url), { concurrency: 20 })
  }

  console.log('Fetching encounter location/area/version data...')
  await pMap(
    pokemons,
    async (pokemon) => {
      if (!pokemon.location_area_encounters) return
      const encounters = await pokeapi.getResource<PokemonEncounter[]>(
        pokemon.location_area_encounters
      )
      if (encounters.length === 0) return

      // Fetch location areas
      const areaUrls = [...new Set(encounters.map((e) => e.location_area.url))]
      await pMap(areaUrls, (u) => pokeapi.getResource<LocationArea>(u), { concurrency: 20 })

      // Fetch versions
      const versionUrls = [
        ...new Set(encounters.flatMap((e) => e.version_details?.map((v) => v.version.url) || [])),
      ]
      await pMap(versionUrls, (u) => pokeapi.getResource<Version>(u), { concurrency: 20 })

      // Fetch encounter methods
      const methodUrls = [
        ...new Set(
          encounters.flatMap(
            (e) =>
              e.version_details?.flatMap(
                (v) => v.encounter_details?.map((d) => d.method.url) || []
              ) || []
          )
        ),
      ]
      await pMap(methodUrls, (u) => pokeapi.getResource<EncounterMethod>(u), { concurrency: 20 })
    },
    { concurrency: 6 }
  )

  // Build and write output
  console.log('Exporting cache...')
  const output: Record<string, unknown> = {}
  for (const [url, promise] of pokeapi.getCache()) {
    output[url] = await promise
  }

  fs.mkdirSync('build', { recursive: true })
  fs.writeFileSync(DATA_PATH, JSON.stringify(output))

  const size = fs.statSync(DATA_PATH).size
  console.log(
    `Done! Wrote ${Object.keys(output).length} resources (${(size / 1024 / 1024).toFixed(1)} MB) to ${DATA_PATH}`
  )
}
