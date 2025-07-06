'use client'

import CardGrid from '@/components/compounds/CardGrid'
import MonsterCard from '@/components/compounds/MonsterCard'

export default function SpeciesCardGrid({
  speciesData,
}: {
  speciesData: { id: number; slug: string; name: string }[]
}) {
  return (
    <CardGrid
      data={speciesData}
      renderCardAction={(item) => (
        <MonsterCard id={item.id} slug={item.slug} name={item.name} />
      )}
      getKeyAction={(item) => item.id}
      searchKeys={['id', 'slug', 'name']}
    />
  )
}
