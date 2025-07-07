'use client'

import CardGrid from '@/components/compounds/CardGrid'
import ItemCard from '@/components/compounds/ItemCard'

export default function ItemCardGrid({
  itemsData,
}: {
  itemsData: {
    id: number
    slug: string
    name: string
    description: string
    imageUrl: string
  }[]
}) {
  return (
    <CardGrid
      data={itemsData}
      renderCardAction={(item) => (
        <ItemCard
          id={item.id}
          slug={item.slug}
          name={item.name}
          description={item.description}
          imageUrl={item.imageUrl}
        />
      )}
      getKeyAction={(item) => item.id}
      searchKeys={['id', 'slug', 'name']}
      itemsPerPage={24}
      className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    />
  )
}
