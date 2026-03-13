import AppShell from '@/components/AppShell'
import SpeciesCardGrid from '@/components/compounds/SpeciesCardGrid'
import type { MonsterCardProps } from '@/components/compounds/MonsterCard'

export default function HomePageContent({ data }: { data: MonsterCardProps[] }) {
  return (
    <AppShell>
      <div className="mx-auto max-w-[96rem]">
        <SpeciesCardGrid data={data} />
      </div>
    </AppShell>
  )
}
