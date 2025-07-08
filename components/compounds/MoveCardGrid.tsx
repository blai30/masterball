'use client'

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
  return (
    <CardGrid
      data={data}
      renderCardAction={(props) => <MoveCard props={props} />}
      getKeyAction={(item) => item.id}
      searchKeys={['id', 'slug', 'name']}
      itemsPerPage={itemsPerPage}
      className={
        className ??
        'grid w-full grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
      }
    />
  )
}
