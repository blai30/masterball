import { createColumnHelper } from '@tanstack/react-table'

import CardGrid, {
  cardGridFeatures,
  type CardGridFilter,
  type CardGridSort,
} from '@/components/compounds/CardGrid'
import MonsterCard, { type MonsterCardProps } from '@/components/compounds/MonsterCard'
import { TYPES, type TypeKey } from '@/lib/domain/types'

const columnHelper = createColumnHelper<typeof cardGridFeatures, MonsterCardProps>()

const columns = columnHelper.columns([
  columnHelper.accessor('id', { enableGlobalFilter: true }),
  columnHelper.accessor('name', { enableGlobalFilter: true }),
  columnHelper.accessor('types', {
    enableGlobalFilter: false,
    // Filter by all selected types - same as every().
    filterFn: (row, columnId, filterValue: string[]) =>
      filterValue.every((value) => row.getValue<TypeKey[]>(columnId).includes(value as TypeKey)),
  }),
])

const filters: CardGridFilter<MonsterCardProps>[] = [
  {
    id: 'types',
    label: 'Type',
    param: 'type',
    options: Object.entries(TYPES).map(([value, label]) => ({ label, value })),
  },
]

const sort: CardGridSort = {
  defaultKey: 'id',
  options: [
    { label: 'Dex No.', value: 'id' },
    { label: 'Name', value: 'name' },
  ],
}

export default function SpeciesCardGrid({ data }: { data: MonsterCardProps[] }) {
  return (
    <CardGrid
      data={data}
      columns={columns}
      renderCard={(item) => <MonsterCard props={item} />}
      getKey={(item) => `${item.slug}-${item.id}`}
      itemsPerPage={60}
      gridClassName="2xs:grid-cols-3 xs:grid-cols-4 grid w-full grid-cols-2 gap-2 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 2xl:grid-cols-10"
      filters={filters}
      sort={sort}
    />
  )
}
