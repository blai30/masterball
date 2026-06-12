export const DAMAGE_CLASSES = {
  physical: 'Physical',
  special: 'Special',
  status: 'Status',
} as const

export type DamageClassKey = keyof typeof DAMAGE_CLASSES
