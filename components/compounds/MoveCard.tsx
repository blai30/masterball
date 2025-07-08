'use client'

import Image from 'next/image'
import clsx from 'clsx/lite'
import { FlavorText } from 'pokedex-promise-v2'
import GlassCard from '@/components/GlassCard'
import { DamageClassKey, TypeKey } from '@/lib/utils/pokeapiHelpers'
import TypeIcon from '@/components/TypeIcon'
import { useVersionGroup } from '@/lib/stores/version-group'

export type MoveCardProps = {
  id: number
  slug: string
  name: string
  defaultDescription: string
  flavorTextEntries: FlavorText[]
  type: string
  damageClass: string
  power?: number
  accuracy?: number
  pp?: number
}

const cardClasses: Record<DamageClassKey, string> = {
  [DamageClassKey.Physical]:
    'bg-gradient-to-br from-transparent to-physical/10 inset-ring-1 inset-ring-physical/10 dark:inset-ring-physical/10 dark:from-transparent dark:to-physical/10',
  [DamageClassKey.Special]:
    'bg-gradient-to-br from-transparent to-special/10 inset-ring-1 inset-ring-special/10 dark:inset-ring-special/10 dark:from-transparent dark:to-special/10',
  [DamageClassKey.Status]:
    'bg-gradient-to-br from-transparent to-status/10 inset-ring-1 inset-ring-status/10 dark:inset-ring-status/10 dark:from-transparent dark:to-status/10',
}

export default function MoveCard({ props }: { props: MoveCardProps }) {
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
          cardClasses[props.damageClass as DamageClassKey]
        )}
      >
        <div className="absolute right-0 bottom-0 size-32 opacity-5">
          <Image
            src={`${process.env.NEXT_PUBLIC_BASEPATH}/${props.damageClass}.png`}
            alt={props.damageClass}
            width={128}
            height={128}
            className="size-full object-contain invert-100 dark:invert-0"
          />
        </div>
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
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col items-baseline justify-between">
            <span className="w-full text-center text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Power
            </span>
            <span className="font-num w-full text-center text-lg font-medium">
              {props.power ?? '—'}
            </span>
          </div>
          <div className="flex flex-col items-baseline justify-between">
            <span className="w-full text-center text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Accuracy
            </span>
            <span className="font-num w-full text-center text-lg font-medium">
              {props.accuracy ?? '—'}
              <span className="ml-0.5 text-zinc-600 dark:text-zinc-400">%</span>
            </span>
          </div>
          <div className="flex flex-col items-baseline justify-between">
            <span className="w-full text-center text-xs font-medium text-zinc-500 dark:text-zinc-400">
              PP
            </span>
            <span className="font-num w-full text-center text-lg font-medium">
              {props.pp}
            </span>
          </div>
        </div>
      </div>
    </GlassCard>
  )
}
