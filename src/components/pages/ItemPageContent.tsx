import AppShell from '@/components/AppShell'
import ItemCardGrid from '@/components/compounds/ItemCardGrid'
import type { ItemCardProps } from '@/components/compounds/ItemCard'

export default function ItemPageContent({ data }: { data: ItemCardProps[] }) {
  return (
    <AppShell>
      <div className="mx-auto w-full max-w-[96rem]">
        <ItemCardGrid data={data} />
      </div>
    </AppShell>
  )
}
