import Pokedex, { type NamedAPIResourceList } from 'pokedex-promise-v2'

const data: NamedAPIResourceList = {
  count: 1025,
  next: null,
  previous: null,
  results: [
    {
      name: 'bulbasaur',
      url: 'https://pokeapi.co/api/v2/pokemon-species/1/',
    },
    {
      name: 'charizard',
      url: 'https://pokeapi.co/api/v2/pokemon-species/6/',
    },
    {
      name: 'pikachu',
      url: 'https://pokeapi.co/api/v2/pokemon-species/25/',
    },
    {
      name: 'nidoran-m',
      url: 'https://pokeapi.co/api/v2/pokemon-species/32/',
    },
    {
      name: 'ninetales',
      url: 'https://pokeapi.co/api/v2/pokemon-species/38/',
    },
    {
      name: 'farfetchd',
      url: 'https://pokeapi.co/api/v2/pokemon-species/83/',
    },
    {
      name: 'mr-mime',
      url: 'https://pokeapi.co/api/v2/pokemon-species/122/',
    },
    {
      name: 'eevee',
      url: 'https://pokeapi.co/api/v2/pokemon-species/133/',
    },
    {
      name: 'mew',
      url: 'https://pokeapi.co/api/v2/pokemon-species/151/',
    },
    {
      name: 'shuckle',
      url: 'https://pokeapi.co/api/v2/pokemon-species/213/',
    },
    {
      name: 'blissey',
      url: 'https://pokeapi.co/api/v2/pokemon-species/242/',
    },
    {
      name: 'swampert',
      url: 'https://pokeapi.co/api/v2/pokemon-species/260/',
    },
    {
      name: 'wurmple',
      url: 'https://pokeapi.co/api/v2/pokemon-species/265/',
    },
    {
      name: 'aggron',
      url: 'https://pokeapi.co/api/v2/pokemon-species/306/',
    },
    {
      name: 'rayquaza',
      url: 'https://pokeapi.co/api/v2/pokemon-species/384/',
    },
    {
      name: 'deoxys',
      url: 'https://pokeapi.co/api/v2/pokemon-species/386/',
    },
    {
      name: 'gastrodon',
      url: 'https://pokeapi.co/api/v2/pokemon-species/423/',
    },
    {
      name: 'garchomp',
      url: 'https://pokeapi.co/api/v2/pokemon-species/445/',
    },
    {
      name: 'glaceon',
      url: 'https://pokeapi.co/api/v2/pokemon-species/471/',
    },
    {
      name: 'gallade',
      url: 'https://pokeapi.co/api/v2/pokemon-species/475/',
    },
    {
      name: 'chesnaught',
      url: 'https://pokeapi.co/api/v2/pokemon-species/652/',
    },
    {
      name: 'greninja',
      url: 'https://pokeapi.co/api/v2/pokemon-species/658/',
    },
    {
      name: 'talonflame',
      url: 'https://pokeapi.co/api/v2/pokemon-species/663/',
    },
    {
      name: 'aegislash',
      url: 'https://pokeapi.co/api/v2/pokemon-species/681/',
    },
    {
      name: 'yveltal',
      url: 'https://pokeapi.co/api/v2/pokemon-species/717/',
    },
    {
      name: 'volcanion',
      url: 'https://pokeapi.co/api/v2/pokemon-species/721/',
    },
    {
      name: 'trumbeak',
      url: 'https://pokeapi.co/api/v2/pokemon-species/732/',
    },
    {
      name: 'crabominable',
      url: 'https://pokeapi.co/api/v2/pokemon-species/740/',
    },
    {
      name: 'rockruff',
      url: 'https://pokeapi.co/api/v2/pokemon-species/744/',
    },
    {
      name: 'salazzle',
      url: 'https://pokeapi.co/api/v2/pokemon-species/758/',
    },
    {
      name: 'lunala',
      url: 'https://pokeapi.co/api/v2/pokemon-species/792/',
    },
    {
      name: 'necrozma',
      url: 'https://pokeapi.co/api/v2/pokemon-species/800/',
    },
    {
      name: 'hatterene',
      url: 'https://pokeapi.co/api/v2/pokemon-species/858/',
    },
    {
      name: 'eternatus',
      url: 'https://pokeapi.co/api/v2/pokemon-species/890/',
    },
    {
      name: 'roaring-moon',
      url: 'https://pokeapi.co/api/v2/pokemon-species/1005/',
    },
    {
      name: 'chi-yu',
      url: 'https://pokeapi.co/api/v2/pokemon-species/1004/',
    },
    {
      name: 'pecharunt',
      url: 'https://pokeapi.co/api/v2/pokemon-species/1025/',
    },
  ],
}

export const pokeapi = new Pokedex({
  // 3 months
  cacheLimit: 1000 * 60 * 60 * 24 * 30 * 3,
  // 5 minutes
  timeout: 300000,
})

export const getTestSpeciesList = async () => {
  await new Promise((resolve) => setTimeout(resolve, 10))
  return data
}
