'use client'

import Image from 'next/image'
import clsx from 'clsx/lite'
import { useVersionGroup } from '@/lib/stores/version-group'
import {
  type DamageClassKey,
  DamageClassLabels,
  type MoveInfo,
  TypeKey,
} from '@/lib/utils/pokeapiHelpers'
import GlassCard from '@/components/GlassCard'
import TypeIcon from '@/components/TypeIcon'

const typeClasses: Record<TypeKey, string> = {
  [TypeKey.Normal]:
    'bg-gradient-to-br from-transparent to-normal/10 inset-ring-1 inset-ring-normal/10 dark:inset-ring-normal/10 dark:to-normal/10',
  [TypeKey.Fire]:
    'bg-gradient-to-br from-transparent to-fire/10 inset-ring-1 inset-ring-fire/10 dark:inset-ring-fire/10 dark:to-fire/10',
  [TypeKey.Water]:
    'bg-gradient-to-br from-transparent to-water/10 inset-ring-1 inset-ring-water/10 dark:inset-ring-water/10 dark:to-water/10',
  [TypeKey.Grass]:
    'bg-gradient-to-br from-transparent to-grass/10 inset-ring-1 inset-ring-grass/10 dark:inset-ring-grass/10 dark:to-grass/10',
  [TypeKey.Electric]:
    'bg-gradient-to-br from-transparent to-electric/10 inset-ring-1 inset-ring-electric/10 dark:inset-ring-electric/10 dark:to-electric/10',
  [TypeKey.Ice]:
    'bg-gradient-to-br from-transparent to-ice/10 inset-ring-1 inset-ring-ice/10 dark:inset-ring-ice/10 dark:to-ice/10',
  [TypeKey.Fighting]:
    'bg-gradient-to-br from-transparent to-fighting/10 inset-ring-1 inset-ring-fighting/10 dark:inset-ring-fighting/10 dark:to-fighting/10',
  [TypeKey.Poison]:
    'bg-gradient-to-br from-transparent to-poison/10 inset-ring-1 inset-ring-poison/10 dark:inset-ring-poison/10 dark:to-poison/10',
  [TypeKey.Ground]:
    'bg-gradient-to-br from-transparent to-ground/10 inset-ring-1 inset-ring-ground/10 dark:inset-ring-ground/10 dark:to-ground/10',
  [TypeKey.Flying]:
    'bg-gradient-to-br from-transparent to-flying/10 inset-ring-1 inset-ring-flying/10 dark:inset-ring-flying/10 dark:to-flying/10',
  [TypeKey.Psychic]:
    'bg-gradient-to-br from-transparent to-psychic/10 inset-ring-1 inset-ring-psychic/10 dark:inset-ring-psychic/10 dark:to-psychic/10',
  [TypeKey.Bug]:
    'bg-gradient-to-br from-transparent to-bug/10 inset-ring-1 inset-ring-bug/10 dark:inset-ring-bug/10 dark:to-bug/10',
  [TypeKey.Rock]:
    'bg-gradient-to-br from-transparent to-rock/10 inset-ring-1 inset-ring-rock/10 dark:inset-ring-rock/10 dark:to-rock/10',
  [TypeKey.Ghost]:
    'bg-gradient-to-br from-transparent to-ghost/10 inset-ring-1 inset-ring-ghost/10 dark:inset-ring-ghost/10 dark:to-ghost/10',
  [TypeKey.Dragon]:
    'bg-gradient-to-br from-transparent to-dragon/10 inset-ring-1 inset-ring-dragon/10 dark:inset-ring-dragon/10 dark:to-dragon/10',
  [TypeKey.Dark]:
    'bg-gradient-to-br from-transparent to-dark/10 inset-ring-1 inset-ring-dark/10 dark:inset-ring-dark/10 dark:to-dark/10',
  [TypeKey.Steel]:
    'bg-gradient-to-br from-transparent to-steel/10 inset-ring-1 inset-ring-steel/10 dark:inset-ring-steel/10 dark:to-steel/10',
  [TypeKey.Fairy]:
    'bg-gradient-to-br from-transparent to-fairy/10 inset-ring-1 inset-ring-fairy/10 dark:inset-ring-fairy/10 dark:to-fairy/10',
}

export default function MoveCard({ props }: { props: MoveInfo }) {
  const { versionGroup, hasMounted } = useVersionGroup()
  if (!hasMounted) return null

  const description =
    props.flavorTextEntries.find(
      (entry) =>
        entry.language.name === 'en' &&
        entry.version_group?.name === versionGroup
    )?.flavor_text ?? props.defaultDescription

  return (
    <GlassCard variant="default" className="relative h-full rounded-xl">
      <div
        className={clsx(
          'absolute -z-10 size-full rounded-xl',
          typeClasses[props.type as TypeKey]
        )}
      >
        <div className="absolute right-0 bottom-0 size-32 opacity-5"></div>
      </div>
      <div className="flex h-full flex-col justify-between gap-4 rounded-xl p-4">
        <div className="flex flex-row items-start gap-4">
          <div className="flex flex-col gap-2">
            <TypeIcon
              variant={props.type as TypeKey}
              size="large"
              className="shrink-0"
            />
          </div>
          <div className="flex flex-col items-start gap-1">
            <h3 className="text-lg font-medium text-black dark:text-white">
              {props.name}
            </h3>
            <p className="text-base font-normal text-zinc-600 dark:text-zinc-400">
              {description}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <div className="flex flex-col items-center">
            <span className="w-full text-center text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Class
            </span>
            <div className="h-full w-6 py-1">
              <span className="sr-only">
                {DamageClassLabels[props.damageClass as DamageClassKey]}
              </span>
              <Image
                src={`${process.env.NEXT_PUBLIC_BASEPATH}/${props.damageClass}.png`}
                alt={DamageClassLabels[props.damageClass as DamageClassKey]}
                width={128}
                height={128}
                title={DamageClassLabels[props.damageClass as DamageClassKey]}
                className="size-full object-contain invert-100 dark:invert-0"
              />
            </div>
          </div>
          <div className="flex flex-col items-baseline justify-between">
            <span className="w-full text-center text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Power
            </span>
            <span className="font-num w-full text-center text-xl font-medium">
              {props.power || '—'}
            </span>
          </div>
          <div className="flex flex-col items-baseline justify-between">
            <span className="w-full text-center text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Accuracy
            </span>
            <span className="font-num w-full text-center text-xl font-medium">
              {props.accuracy || '—'}
              <span className="ml-0.5 text-zinc-600 dark:text-zinc-400">%</span>
            </span>
          </div>
          <div className="flex flex-col items-baseline justify-between">
            <span className="w-full text-center text-xs font-medium text-zinc-500 dark:text-zinc-400">
              PP
            </span>
            <span className="font-num w-full text-center text-xl font-medium">
              {props.pp}
            </span>
          </div>
        </div>
      </div>
    </GlassCard>
  )
}
