import AppShell from '@/components/AppShell'
import InfoCardGrid from '@/components/compounds/InfoCardGrid'
import type { InfoCardProps } from '@/components/compounds/InfoCard'

export default function AbilityPageContent({ data }: { data: InfoCardProps[] }) {
  return (
    <AppShell>
      <div className="mx-auto w-full max-w-[96rem]">
        <InfoCardGrid data={data} filterByVersionGroup={true} />
      </div>
    </AppShell>
  )
}
