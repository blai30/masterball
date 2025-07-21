import type { Pokemon, PokemonSpecies } from 'pokedex-promise-v2'
import pokeapi from '@/lib/api/pokeapi'
import { getTestSpeciesList } from '@/lib/providers'
import { excludedVariants } from '@/lib/utils/excludedSlugs'
import { getTranslation, TypeKey } from '@/lib/utils/pokeapiHelpers'

type SpeciesData = {
  species: PokemonSpecies[]
  speciesPokemon: Record<string, Pokemon>
}

// Build cache interface
interface BuildCache {
  get<T>(key: string): Promise<T | null>
  set<T>(key: string, data: T, ttl: number): Promise<void>
}

// Import buildCache only during build time
let buildCache: BuildCache | null = null
if (typeof window === 'undefined' && process.env.NODE_ENV !== 'test') {
  try {
    const cacheModule = require('@/lib/cache/buildCache')
    buildCache = cacheModule.default
  } catch {
    // Fallback if cache is not available
    buildCache = null
  }
}

class DataService {
  private static instance: DataService | null = null
  private speciesDataPromise: Promise<SpeciesData> | null = null

  static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService()
    }
    return DataService.instance
  }

  /**
   * Get all species and Pokemon data with caching and deduplication
   */
  async getSpeciesData(): Promise<SpeciesData> {
    // Return existing promise if already fetching
    if (this.speciesDataPromise) {
      return this.speciesDataPromise
    }

    // Start fetching and cache the promise
    this.speciesDataPromise = this.fetchSpeciesData()
    return this.speciesDataPromise
  }

  private async fetchSpeciesData(): Promise<SpeciesData> {
    const cacheKey = 'species-data-complete'
    
    // Try to get from build cache first (only during build)
    if (buildCache && typeof window === 'undefined') {
      try {
        const cached = await buildCache.get<SpeciesData>(cacheKey)
        if (cached) {
          console.log('Using cached species data')
          return cached
        }
      } catch (error) {
        console.warn('Cache read failed:', error)
      }
    }

    console.log('Fetching fresh species data...')
    
    // Get species list
    const speciesList = process?.env?.NODE_ENV === 'development'
      ? await getTestSpeciesList()
      : await pokeapi.getList('pokemon-species', 1025, 0)

    // Fetch all species data in parallel with increased concurrency
    const species = await pokeapi.batchFetchAndTransform(
      speciesList.results,
      async (result) => {
        return pokeapi.getResource<PokemonSpecies>(result.url)
      },
      8 // Increased concurrency
    )

    // Fetch Pokemon data for each species in parallel
    const speciesPokemonEntries = await pokeapi.batchFetchAndTransform(
      species,
      async (specie) => {
        const defaultVariant = specie.varieties
          .filter((variant) => !excludedVariants.includes(variant.pokemon.name))
          .find((v) => v.is_default)

        if (!defaultVariant) {
          console.warn(`No default variant found for species: ${specie.name}`)
          return null
        }

        const pokemon = await pokeapi.getResource<Pokemon>(defaultVariant.pokemon.url)
        return [specie.name, pokemon] as const
      },
      8 // Increased concurrency
    )

    // Filter out null entries and create the record
    const speciesPokemon = Object.fromEntries(
      speciesPokemonEntries.filter((entry): entry is [string, Pokemon] => entry !== null)
    )

    const data: SpeciesData = {
      species,
      speciesPokemon,
    }

    // Cache the complete dataset (only during build)
    if (buildCache && typeof window === 'undefined') {
      try {
        const ttl = process?.env?.NODE_ENV === 'development' ? 60 * 1000 : 6 * 60 * 60 * 1000
        await buildCache.set<SpeciesData>(cacheKey, data, ttl)
        console.log(`Fetched and cached data for ${species.length} species`)
      } catch (error) {
        console.warn('Cache write failed:', error)
      }
    }

    return data
  }

  /**
   * Get static params for all pages
   */
  async getStaticParams() {
    const { species } = await this.getSpeciesData()
    
    return species.flatMap((specie) =>
      specie.varieties
        .filter((variant) => !excludedVariants.includes(variant.pokemon.name))
        .map((variant) => ({
          slug: specie.name,
          variant: variant.is_default ? undefined : [variant.pokemon.name],
        }))
    )
  }

  /**
   * Get species by name (from cached data)
   */
  async getSpeciesByName(name: string): Promise<PokemonSpecies | null> {
    const { species } = await this.getSpeciesData()
    return species.find((s) => s.name === name) || null
  }

  /**
   * Get Pokemon by species name (from cached data)
   */
  async getPokemonBySpecies(speciesName: string): Promise<Pokemon | null> {
    const { speciesPokemon } = await this.getSpeciesData()
    return speciesPokemon[speciesName] || null
  }

  /**
   * Get transformed species data for the grid
   */
  async getSpeciesGridData() {
    const { species, speciesPokemon } = await this.getSpeciesData()
    
    return species.map((specie) => {
      const pokemon = speciesPokemon[specie.name]
      if (!pokemon) {
        console.warn(`No Pokemon data found for species: ${specie.name}`)
        return {
          id: specie.id,
          slug: specie.name,
          name: getTranslation(specie.names, 'name')!,
          types: [] as TypeKey[],
        }
      }
      
      return {
        id: specie.id,
        slug: specie.name,
        name: getTranslation(specie.names, 'name')!,
        types: pokemon.types.map((type) => type.type.name as TypeKey),
      }
    })
  }
}

export const dataService = DataService.getInstance()
export default dataService