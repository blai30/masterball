import clsx from 'clsx/lite'
import { memo } from 'react'

import { TypeIcon } from '@/components/icons'
import { DAMAGE_CLASSES, type DamageClassKey } from '@/lib/domain/damage-class'
import type { MoveInfo } from '@/lib/domain/moves'
import { useVersionGroup } from '@/lib/stores/version-group'

const MoveCard = ({ props }: { props: MoveInfo }) => {
  const { versionGroup } = useVersionGroup()

  const description =
    props.flavorTextEntries.find(
      (entry) => entry.language.name === 'en' && entry.version_group?.name === versionGroup
    )?.flavor_text ?? props.defaultDescription

  return (
    <div className="relative h-full rounded-xl bg-white inset-ring-1 inset-ring-zinc-100 backdrop-blur-xl dark:bg-black dark:inset-ring-zinc-900">
      <div
        className={clsx('absolute -z-10 size-full rounded-xl opacity-15', `bg-${props.type}`)}
      ></div>
      <div className="flex h-full flex-col justify-between gap-4 rounded-xl p-4">
        <div className="flex flex-row items-start gap-4">
          <div className="flex flex-col gap-2">
            <TypeIcon variant={props.type} size="large" className="shrink-0" />
          </div>
          <div className="flex flex-col items-start gap-1">
            <h3 className="text-lg font-medium text-black dark:text-white">{props.name}</h3>
            <p className="text-base font-normal text-zinc-600 dark:text-zinc-400">{description}</p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <div className="flex flex-col items-center">
            <span className="w-full text-center text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Class
            </span>
            <div className="h-full w-6 py-1">
              <span className="sr-only">{DAMAGE_CLASSES[props.damageClass as DamageClassKey]}</span>
              <img
                src={`${props.damageClass}.png`}
                alt={DAMAGE_CLASSES[props.damageClass as DamageClassKey]}
                width={128}
                height={128}
                title={DAMAGE_CLASSES[props.damageClass as DamageClassKey]}
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
            <span className="font-num w-full text-center text-xl font-medium">{props.pp}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(MoveCard)
