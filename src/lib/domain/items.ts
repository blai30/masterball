export const ITEM_POCKETS = {
  misc: 'Items',
  medicine: 'Medicine',
  pokeballs: 'Poké Balls',
  machines: 'TMs and HMs',
  berries: 'Berries',
  mail: 'Mail',
  battle: 'Battle Items',
  key: 'Key Items',
} as const

export type ItemPocketKey = keyof typeof ITEM_POCKETS

export const ITEM_CATEGORIES = {
  'stat-boosts': {
    label: 'Stat boosts',
    pocket: 'battle',
  },
  'effort-drop': {
    label: 'Effort drop',
    pocket: 'berries',
  },
  medicine: {
    label: 'Medicine',
    pocket: 'berries',
  },
  other: {
    label: 'Other',
    pocket: 'berries',
  },
  'in-a-pinch': {
    label: 'In a pinch',
    pocket: 'berries',
  },
  'picky-healing': {
    label: 'Picky healing',
    pocket: 'berries',
  },
  'type-protection': {
    label: 'Type protection',
    pocket: 'berries',
  },
  'baking-only': {
    label: 'Baking only',
    pocket: 'berries',
  },
  collectibles: {
    label: 'Collectibles',
    pocket: 'misc',
  },
  evolution: {
    label: 'Evolution',
    pocket: 'misc',
  },
  spelunking: {
    label: 'Spelunking',
    pocket: 'misc',
  },
  'held-items': {
    label: 'Held items',
    pocket: 'misc',
  },
  choice: {
    label: 'Choice',
    pocket: 'misc',
  },
  'effort-training': {
    label: 'Effort training',
    pocket: 'misc',
  },
  'bad-held-items': {
    label: 'Bad held items',
    pocket: 'misc',
  },
  training: {
    label: 'Training',
    pocket: 'misc',
  },
  plates: {
    label: 'Plates',
    pocket: 'misc',
  },
  'species-specific': {
    label: 'Species-specific',
    pocket: 'misc',
  },
  'type-enhancement': {
    label: 'Type enhancement',
    pocket: 'misc',
  },
  'event-items': {
    label: 'Event items',
    pocket: 'key',
  },
  gameplay: {
    label: 'Gameplay',
    pocket: 'key',
  },
  'plot-advancement': {
    label: 'Plot advancement',
    pocket: 'key',
  },
  unused: {
    label: 'Unused',
    pocket: 'key',
  },
  loot: {
    label: 'Loot',
    pocket: 'misc',
  },
  'all-mail': {
    label: 'All mail',
    pocket: 'mail',
  },
  vitamins: {
    label: 'Vitamins',
    pocket: 'medicine',
  },
  healing: {
    label: 'Healing',
    pocket: 'medicine',
  },
  'pp-recovery': {
    label: 'PP recovery',
    pocket: 'medicine',
  },
  revival: {
    label: 'Revival',
    pocket: 'medicine',
  },
  'status-cures': {
    label: 'Status cures',
    pocket: 'medicine',
  },
  mulch: {
    label: 'Mulch',
    pocket: 'misc',
  },
  'special-balls': {
    label: 'Special balls',
    pocket: 'pokeballs',
  },
  'standard-balls': {
    label: 'Standard balls',
    pocket: 'pokeballs',
  },
  'dex-completion': {
    label: 'Dex completion',
    pocket: 'misc',
  },
  scarves: {
    label: 'Scarves',
    pocket: 'misc',
  },
  'all-machines': {
    label: 'All machines',
    pocket: 'machines',
  },
  flutes: {
    label: 'Flutes',
    pocket: 'battle',
  },
  'apricorn-balls': {
    label: 'Apricorn balls',
    pocket: 'pokeballs',
  },
  'apricorn-box': {
    label: 'Apricorn Box',
    pocket: 'key',
  },
  'data-cards': {
    label: 'Data Cards',
    pocket: 'key',
  },
  jewels: {
    label: 'Jewels',
    pocket: 'misc',
  },
  'miracle-shooter': {
    label: 'Miracle Shooter',
    pocket: 'battle',
  },
  'mega-stones': {
    label: 'Mega Stones',
    pocket: 'misc',
  },
  memories: {
    label: 'Memories',
    pocket: 'misc',
  },
  'z-crystals': {
    label: 'Z-Crystals',
    pocket: 'key',
  },
  'species-candies': {
    label: 'Species candies',
    pocket: 'misc',
  },
  'catching-bonus': {
    label: 'Catching bonus',
    pocket: 'berries',
  },
  'dynamax-crystals': {
    label: 'Dynamax crystals',
    pocket: 'misc',
  },
  'nature-mints': {
    label: 'Nature mints',
    pocket: 'medicine',
  },
  'curry-ingredients': {
    label: 'Curry ingredients',
    pocket: 'misc',
  },
  'tera-shard': {
    label: 'Tera Shard',
    pocket: 'misc',
  },
  'sandwich-ingredients': {
    label: 'Sandwich ingredients',
    pocket: 'misc',
  },
  'tm-materials': {
    label: 'TM Materials',
    pocket: 'misc',
  },
  picnic: {
    label: 'Picnic items',
    pocket: 'misc',
  },
} as const

export type ItemCategoryKey = keyof typeof ITEM_CATEGORIES
