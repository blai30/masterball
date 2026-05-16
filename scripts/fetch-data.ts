/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

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
  NamedAPIResourceList,
} from 'pokedex-promise-v2'

import { excludedItems, excludedVariants, excludedForms } from '../src/lib/utils/excluded-slugs'

const BASE_URL = 'https://pokeapi.co/api/v2/'
const DATA_PATH = 'build/data.json'

const cache = new Map<string, Promise<unknown>>()

async function cachedFetch<T>(url: string): Promise<T> {
  if (!cache.has(url)) {
    cache.set(
      url,
      fetch(url).then(async (res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch ${url}: ${res.statusText}`)
        }
        return (await res.json()) as T
      })
    )
  }
  return cache.get(url) as Promise<T>
}

async function getList(endpoint: string, limit: number): Promise<NamedAPIResourceList> {
  const params = new URLSearchParams({ limit: String(limit), offset: '0' })
  const url = new URL(endpoint, BASE_URL)
  url.search = params.toString()
  return cachedFetch<NamedAPIResourceList>(url.toString())
}

async function getByName<T>(endpoint: string, nameOrId: string | number): Promise<T> {
  const url = new URL(endpoint, BASE_URL)
  url.pathname += `/${nameOrId}`
  return cachedFetch<T>(url.toString())
}

async function getResource<T>(url: string): Promise<T> {
  return cachedFetch<T>(url)
}

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
  console.log('Fetching species list...')
  const speciesList = await getList('pokemon-species', 1025)

  console.log(`Fetching ${speciesList.results.length} species details...`)
  const speciesArr = await pMap(speciesList.results, (r) => getResource<PokemonSpecies>(r.url), {
    concurrency: 20,
  })

  console.log('Collecting all Pokemon variant URLs...')
  const pokemonUrls = new Set<string>()
  for (const specie of speciesArr) {
    const filtered = specie.varieties.filter((v) => !excludedVariants.includes(v.pokemon.name))
    for (const v of filtered) {
      pokemonUrls.add(v.pokemon.url)
    }
  }

  console.log(`Fetching ${pokemonUrls.size} Pokemon details...`)
  const pokemonArr = await pMap([...pokemonUrls], (url) => getResource<Pokemon>(url), {
    concurrency: 20,
  })

  console.log('Fetching all types...')
  await pMap(
    [
      'normal',
      'fighting',
      'flying',
      'poison',
      'ground',
      'rock',
      'bug',
      'ghost',
      'steel',
      'fire',
      'water',
      'grass',
      'electric',
      'psychic',
      'ice',
      'dragon',
      'dark',
      'fairy',
    ],
    (name) => getByName<Type>('type', name),
    { concurrency: 20 }
  )

  console.log('Fetching all abilities...')
  const abilityList = await getList('ability', 600)
  await pMap(abilityList.results, (r) => getResource<Ability>(r.url), { concurrency: 20 })

  console.log('Fetching all moves...')
  const moveList = await getList('move', 1200)
  const moveArr = await pMap(moveList.results, (r) => getResource<Move>(r.url), { concurrency: 20 })

  console.log('Fetching all items...')
  const itemList = await getList('item', 10000)
  const filteredItems = itemList.results.filter(
    (r) => !excludedItems.includes(r.name) && !r.name.startsWith('dynamax-crystal-')
  )
  await pMap(filteredItems, (r) => getResource<Item>(r.url), { concurrency: 20 })

  console.log('Fetching location encounters for all Pokemon...')
  await pMap(
    pokemonArr,
    async (pkm) => {
      if (pkm.location_area_encounters) {
        await getResource(pkm.location_area_encounters)
      }
    },
    { concurrency: 20 }
  )

  console.log('Fetching species reference data...')
  await pMap(
    speciesArr,
    async (specie) => {
      if (specie.growth_rate.url) {
        await getResource<GrowthRate>(specie.growth_rate.url)
      }
      if (specie.egg_groups?.length) {
        await pMap(specie.egg_groups, (eg) => getResource<EggGroup>(eg.url), { concurrency: 4 })
      }
      if (specie.evolution_chain.url) {
        const chain = await getResource<EvolutionChain>(specie.evolution_chain.url)
        // Recursively collect species in evolution chains and fetch them
        const chainNode = (chain as any).chain
        if (chainNode) {
          const walk = (node: any): Promise<PokemonSpecies>[] => {
            const promises = [getResource<PokemonSpecies>(node.species.url)]
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
    pokemonArr,
    async (pkm) => {
      if (pkm.forms?.length) {
        const filtered = pkm.forms.filter((f) => !excludedForms.includes(f.name))
        await pMap(filtered, (form) => getResource<PokemonForm>(form.url), { concurrency: 20 })
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
    await pMap([...machineUrls], (url) => getResource<Machine>(url), { concurrency: 20 })
  }

  console.log('Fetching encounter location/area/version data...')
  await pMap(
    pokemonArr,
    async (pkm) => {
      if (!pkm.location_area_encounters) return
      const encounters = await getResource<PokemonEncounter[]>(pkm.location_area_encounters)
      if (encounters.length === 0) return

      // Fetch location areas
      const areaUrls = [...new Set(encounters.map((e) => e.location_area.url))]
      await pMap(areaUrls, (u) => getResource<LocationArea>(u), { concurrency: 20 })

      // Fetch versions
      const versionUrls = [
        ...new Set(encounters.flatMap((e) => e.version_details?.map((v) => v.version.url) || [])),
      ]
      await pMap(versionUrls, (u) => getResource<Version>(u), { concurrency: 20 })

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
      await pMap(methodUrls, (u) => getResource<EncounterMethod>(u), { concurrency: 20 })

      // Fetch locations for areas that lack English names
      const areaData = await Promise.all(areaUrls.map((u) => getResource<LocationArea>(u)))
      const areasNeedingLocations = areaData.filter((a) => {
        const enName = a.names?.find((n) => n.language.name === 'en')
        return !enName
      })
      if (areasNeedingLocations.length > 0) {
        const locUrls = [...new Set(areasNeedingLocations.map((a) => a.location.url))]
        await pMap(locUrls, (u) => getResource<Location>(u), { concurrency: 20 })
      }
    },
    { concurrency: 6 }
  )

  // Build and write output
  console.log('Exporting cache...')
  const output: Record<string, unknown> = {}
  for (const [url, promise] of cache) {
    output[url] = await promise
  }

  fs.mkdirSync('build', { recursive: true })
  fs.writeFileSync(DATA_PATH, JSON.stringify(output))

  const size = fs.statSync(DATA_PATH).size
  console.log(
    `Done! Wrote ${Object.keys(output).length} resources (${(size / 1024 / 1024).toFixed(1)} MB) to ${DATA_PATH}`
  )
}
