'use client'

import CardGrid from '@/components/compounds/CardGrid'
import MonsterCard, {
  type MonsterCardProps,
} from '@/components/compounds/MonsterCard'

export default function SpeciesCardGrid({
  props,
}: {
  props: MonsterCardProps[]
}) {
  return (
    <CardGrid
      data={props}
      renderCardAction={(data) => <MonsterCard props={data} />}
      getKeyAction={(item) => item.id}
      searchKeys={['id', 'slug', 'name']}
      className="2xs:grid-cols-3 xs:grid-cols-3 grid w-full grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10"
    />
  )
}
