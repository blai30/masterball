import AppShell from '@/components/AppShell'
import MoveCardGrid from '@/components/compounds/MoveCardGrid'
import type { MoveInfo } from '@/lib/utils/pokeapi-helpers'

export default function MovePageContent({ data }: { data: MoveInfo[] }) {
  return (
    <AppShell>
      <div className="mx-auto w-full max-w-[96rem]">
        <MoveCardGrid data={data} filterByVersionGroup={true} />
      </div>
    </AppShell>
  )
}
