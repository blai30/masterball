import { createColumnHelper } from '@tanstack/react-table'

import CardGrid, {
  cardGridFeatures,
  type CardGridFilter,
  type CardGridSort,
} from '@/components/compounds/CardGrid'
import MoveCard from '@/components/compounds/MoveCard'
import { DAMAGE_CLASSES } from '@/lib/domain/damage-class'
import type { MoveInfo } from '@/lib/domain/moves'
import { TYPES } from '@/lib/domain/types'

const columnHelper = createColumnHelper<typeof cardGridFeatures, MoveInfo>()

const columns = columnHelper.columns([
  columnHelper.accessor('name', { enableGlobalFilter: true }),
  columnHelper.accessor('type', {
    enableGlobalFilter: false,
    filterFn: (row, columnId, filterValue: string[]) =>
      filterValue.includes(row.getValue<string>(columnId)),
  }),
  columnHelper.accessor('damageClass', {
    enableGlobalFilter: false,
    filterFn: (row, columnId, filterValue: string[]) =>
      filterValue.includes(row.getValue<string>(columnId)),
  }),
  columnHelper.accessor('power', { enableGlobalFilter: false, sortUndefined: 'last' }),
  columnHelper.accessor('accuracy', { enableGlobalFilter: false, sortUndefined: 'last' }),
  columnHelper.accessor('pp', { enableGlobalFilter: false, sortUndefined: 'last' }),
])

const filters: CardGridFilter<MoveInfo>[] = [
  {
    id: 'type',
    label: 'Type',
    param: 'type',
    options: Object.entries(TYPES).map(([value, label]) => ({ label, value })),
  },
  {
    id: 'damageClass',
    label: 'Class',
    param: 'class',
    options: Object.entries(DAMAGE_CLASSES).map(([value, label]) => ({ label, value })),
  },
]

const sort: CardGridSort = {
  defaultKey: 'name',
  options: [
    { label: 'Name', value: 'name' },
    { label: 'Type', value: 'type' },
    { label: 'Class', value: 'damageClass' },
    { label: 'Power', value: 'power' },
    { label: 'Accuracy', value: 'accuracy' },
    { label: 'PP', value: 'pp' },
  ],
}

export default function MoveCardGrid({
  data,
  filterByVersionGroup = false,
  itemsPerPage = 36,
  className,
}: {
  data: MoveInfo[]
  filterByVersionGroup?: boolean
  itemsPerPage?: number
  className?: string
}) {
  return (
    <CardGrid
      data={data}
      columns={columns}
      renderCard={(item) => <MoveCard props={item} />}
      getKey={(item) => `${item.slug}-${item.id}`}
      itemsPerPage={itemsPerPage}
      gridClassName={
        className ?? 'grid w-full grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
      }
      filters={filters}
      sort={sort}
      versionGroupPredicate={
        filterByVersionGroup
          ? (item, versionGroup) =>
              item.flavorTextEntries.some((entry) => entry.version_group?.name === versionGroup)
          : undefined
      }
    />
  )
}
