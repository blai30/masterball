'use client'

import CardGrid from '@/components/compounds/CardGrid'
import InfoCard from '@/components/compounds/InfoCard'

export default function AbilityCardGrid({
  abilitiesData,
}: {
  abilitiesData: {
    id: number
    slug: string
    name: string
    description: string
  }[]
}) {
  return (
    <CardGrid
      data={abilitiesData}
      renderCardAction={(item) => (
        <InfoCard
          id={item.id}
          slug={item.slug}
          name={item.name}
          description={item.description}
        />
      )}
      getKeyAction={(item) => item.id}
      searchKeys={['id', 'slug', 'name']}
      itemsPerPage={48}
      className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    />
  )
}
