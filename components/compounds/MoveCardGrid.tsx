'use client'

import CardGrid from '@/components/compounds/CardGrid'
import ItemCard from '@/components/compounds/ItemCard'

export default function MoveCardGrid({
  movesData,
}: {
  movesData: {
    id: number
    slug: string
    name: string
    description: string
  }[]
}) {
  return (
    <CardGrid
      data={movesData}
      renderCardAction={(item) => (
        <ItemCard
          id={item.id}
          slug={item.slug}
          name={item.name}
          description={item.description}
        />
      )}
      getKeyAction={(item) => item.id}
      searchKeys={['id', 'slug', 'name']}
      itemsPerPage={24}
      className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    />
  )
}
