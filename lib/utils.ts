export const typeIconUrl = (type: string) => `${process.env.NEXT_PUBLIC_BASEPATH}/${type}.png`

export const typeClasses: { [key: string]: string } = {
  ['normal']: 'bg-[#999999]',
  ['fighting']: 'bg-[#ffa202]',
  ['flying']: 'bg-[#95c9ff]',
  ['poison']: 'bg-[#994dcf]',
  ['ground']: 'bg-[#ab7939]',
  ['rock']: 'bg-[#bcb889]',
  ['bug']: 'bg-[#9fa424]',
  ['ghost']: 'bg-[#6e4570]',
  ['steel']: 'bg-[#6aaed3]',
  ['fire']: 'bg-[#ff612c]',
  ['water']: 'bg-[#2992ff]',
  ['grass']: 'bg-[#42bf24]',
  ['electric']: 'bg-[#ffdb00]',
  ['psychic']: 'bg-[#ff637f]',
  ['ice']: 'bg-[#42d8ff]',
  ['dragon']: 'bg-[#5462d6]',
  ['dark']: 'bg-[#4f4747]',
  ['fairy']: 'bg-[#ffb1ff]',
}
