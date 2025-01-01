export const typeIconUrl = (type: string) => `${process.env.NEXT_PUBLIC_BASEPATH}/${type}.png`

export const typeClasses: { [key: string]: string } = {
  ['normal']: 'bg-normal',
  ['fighting']: 'bg-fighting',
  ['flying']: 'bg-flying',
  ['poison']: 'bg-poison',
  ['ground']: 'bg-ground',
  ['rock']: 'bg-rock',
  ['bug']: 'bg-bug',
  ['ghost']: 'bg-ghost',
  ['steel']: 'bg-steel',
  ['fire']: 'bg-fire',
  ['water']: 'bg-water',
  ['grass']: 'bg-grass',
  ['electric']: 'bg-electric',
  ['psychic']: 'bg-psychic',
  ['ice']: 'bg-ice',
  ['dragon']: 'bg-dragon',
  ['dark']: 'bg-dark',
  ['fairy']: 'bg-fairy',
}
