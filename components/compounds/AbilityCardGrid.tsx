'use client'

import CardGrid from '@/components/compounds/CardGrid'

export default function AbilityCardGrid({
  abilitiesData,
}: {
  abilitiesData: { id: number; slug: string; name: string }[]
}) {
  return (
    <CardGrid
      data={abilitiesData}
      renderCardAction={(item) => (
        <div>{item.name}</div>
      )}
      getKeyAction={(item) => item.id}
      searchKeys={['id', 'slug', 'name']}
    />
  )
}
