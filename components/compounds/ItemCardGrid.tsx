'use client'

import CardGrid from '@/components/compounds/CardGrid'

export default function ItemCardGrid({
  itemsData,
}: {
  itemsData: { id: number; slug: string; name: string }[]
}) {
  return (
    <CardGrid
      data={itemsData}
      renderCardAction={(item) => (
        <div>{item.name}</div>
      )}
      getKeyAction={(item) => item.id}
      searchKeys={['id', 'slug', 'name']}
    />
  )
}
