'use client'

import { useState, useMemo } from 'react'
import CardGrid from '@/components/compounds/CardGrid'
import MoveCard, { type MoveCardProps } from '@/components/compounds/MoveCard'

export default function MoveCardGrid({
  data,
  itemsPerPage = 48,
  className,
}: {
  data: MoveCardProps[]
  itemsPerPage?: number
  className?: string
}) {
  // Extract unique types and damage classes from data
  const types = useMemo(
    () => Array.from(new Set(data.map((m) => m.type))).sort(),
    [data]
  )
  const damageClasses = useMemo(
    () => Array.from(new Set(data.map((m) => m.damageClass))).sort(),
    [data]
  )

  const [typeFilter, setTypeFilter] = useState<string | null>(null)
  const [damageClassFilter, setDamageClassFilter] = useState<string | null>(
    null
  )

  const filteredData = useMemo(() => {
    return data.filter((move) => {
      if (typeFilter && move.type !== typeFilter) return false
      if (damageClassFilter && move.damageClass !== damageClassFilter)
        return false
      return true
    })
  }, [data, typeFilter, damageClassFilter])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Type filter */}
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Type:
          </span>
          <button
            className={`rounded border px-2 py-1 text-xs font-medium ${typeFilter === null ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black' : 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'} border-zinc-300 dark:border-zinc-600`}
            onClick={() => setTypeFilter(null)}
          >
            All
          </button>
          {types.map((type) => (
            <button
              key={type}
              className={`rounded border px-2 py-1 text-xs font-medium ${typeFilter === type ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black' : 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'} border-zinc-300 dark:border-zinc-600`}
              onClick={() => setTypeFilter(type)}
            >
              {type}
            </button>
          ))}
        </div>
        {/* Damage class filter */}
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Class:
          </span>
          <button
            className={`rounded border px-2 py-1 text-xs font-medium ${damageClassFilter === null ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black' : 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'} border-zinc-300 dark:border-zinc-600`}
            onClick={() => setDamageClassFilter(null)}
          >
            All
          </button>
          {damageClasses.map((dc) => (
            <button
              key={dc}
              className={`rounded border px-2 py-1 text-xs font-medium ${damageClassFilter === dc ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black' : 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'} border-zinc-300 dark:border-zinc-600`}
              onClick={() => setDamageClassFilter(dc)}
            >
              {dc}
            </button>
          ))}
        </div>
      </div>
      <CardGrid
        data={filteredData}
        renderCardAction={(props) => <MoveCard props={props} />}
        getKeyAction={(item) => item.id}
        searchKeys={['slug', 'name', 'type', 'damageClass']}
        itemsPerPage={itemsPerPage}
        initialSortKey="name"
        initialSortDirection="asc"
        sortableKeys={[
          'name',
          'type',
          'damageClass',
          'power',
          'accuracy',
          'pp',
        ]}
        className={
          className ??
          'grid w-full grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        }
      />
    </div>
  )
}
