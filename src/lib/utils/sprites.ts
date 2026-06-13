const SPRITE_HOST = 'https://raw.githubusercontent.com/blai30/PokemonSpritesDump/refs/heads/main'

// Monster sprite for a species. Pass variantName only for non-default variants.
export function monsterSpriteUrl(speciesId: number, variantName?: string): string {
  const imageId = speciesId.toString().padStart(4, '0')
  return variantName
    ? `${SPRITE_HOST}/sprites/sprite_${imageId}_${variantName}_s0.webp`
    : `${SPRITE_HOST}/sprites/sprite_${imageId}_s0.webp`
}

export function itemSpriteUrl(name: string): string {
  return `${SPRITE_HOST}/items/item_${name}.webp`
}
