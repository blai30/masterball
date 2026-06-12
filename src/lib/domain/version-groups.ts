// Ordered chronologically.
export const VERSION_GROUPS = {
  'red-blue': 'Red & Blue',
  yellow: 'Yellow',
  'gold-silver': 'Gold & Silver',
  crystal: 'Crystal',
  'ruby-sapphire': 'Ruby & Sapphire',
  emerald: 'Emerald',
  'firered-leafgreen': 'FireRed & LeafGreen',
  'diamond-pearl': 'Diamond & Pearl',
  platinum: 'Platinum',
  'heartgold-soulsilver': 'HeartGold & SoulSilver',
  'black-white': 'Black & White',
  'black-2-white-2': 'Black 2 & White 2',
  'x-y': 'XY',
  'omega-ruby-alpha-sapphire': 'Omega Ruby & Alpha Sapphire',
  'sun-moon': 'Sun & Moon',
  'ultra-sun-ultra-moon': 'Ultra Sun & Ultra Moon',
  'lets-go-pikachu-lets-go-eevee': "Let's Go Pikachu & Let's Go Eevee",
  'sword-shield': 'Sword & Shield',
  'brilliant-diamond-shining-pearl': 'Brilliant Diamond & Shining Pearl',
  'scarlet-violet': 'Scarlet & Violet',
} as const

export type VersionGroupKey = keyof typeof VERSION_GROUPS
