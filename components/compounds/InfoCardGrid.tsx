'use client'

import CardGrid from '@/components/compounds/CardGrid'
import InfoCard, { type InfoCardProps } from '@/components/compounds/InfoCard'

export default function InfoCardGrid({
  data,
  itemsPerPage = 48,
  className,
}: {
  data: InfoCardProps[]
  itemsPerPage?: number
  className?: string
}) {
  return (
    <CardGrid
      data={data}
      renderCardAction={(props) => <InfoCard props={props} />}
      getKeyAction={(item) => item.id}
      searchKeys={['slug', 'name']}
      itemsPerPage={itemsPerPage}
      initialSortKey="name"
      initialSortDirection="asc"
      sortableKeys={['name']}
      className={
        className ??
        'grid w-full grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
      }
    />
  )
}
