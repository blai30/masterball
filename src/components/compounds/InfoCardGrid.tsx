import { createColumnHelper } from '@tanstack/react-table'

import CardGrid, { cardGridFeatures } from '@/components/compounds/CardGrid'
import InfoCard, { type InfoCardProps } from '@/components/compounds/InfoCard'

const columnHelper = createColumnHelper<typeof cardGridFeatures, InfoCardProps>()

const columns = columnHelper.columns([columnHelper.accessor('name', { enableGlobalFilter: true })])

export default function InfoCardGrid({
  data,
  filterByVersionGroup = false,
  itemsPerPage = 48,
  className,
}: {
  data: InfoCardProps[]
  filterByVersionGroup?: boolean
  itemsPerPage?: number
  className?: string
}) {
  return (
    <CardGrid
      data={data}
      columns={columns}
      renderCard={(item) => <InfoCard props={item} />}
      getKey={(item) => `${item.slug}-${item.id}`}
      itemsPerPage={itemsPerPage}
      gridClassName={
        className ?? 'grid w-full grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
      }
      versionGroupPredicate={
        filterByVersionGroup
          ? (item, versionGroup) =>
              item.flavorTextEntries.some((entry) => entry.version_group?.name === versionGroup)
          : undefined
      }
    />
  )
}
