import { createColumnHelper } from '@tanstack/react-table'

import CardGrid, { cardGridFeatures, type CardGridFilter } from '@/components/compounds/CardGrid'
import ItemCard, { type ItemCardProps } from '@/components/compounds/ItemCard'
import { ITEM_CATEGORIES, ITEM_POCKETS } from '@/lib/domain/items'

const columnHelper = createColumnHelper<typeof cardGridFeatures, ItemCardProps>()

const columns = columnHelper.columns([
  columnHelper.accessor('name', { enableGlobalFilter: true }),
  columnHelper.accessor('pocket', {
    enableGlobalFilter: false,
    filterFn: (row, columnId, filterValue: string[]) =>
      filterValue.includes(row.getValue<string>(columnId)),
  }),
  columnHelper.accessor('category', {
    enableGlobalFilter: false,
    filterFn: (row, columnId, filterValue: string[]) =>
      filterValue.includes(row.getValue<string>(columnId)),
  }),
])

const filters: CardGridFilter<ItemCardProps>[] = [
  {
    id: 'pocket',
    label: 'Pocket',
    param: 'pockets',
    options: (data) =>
      [...new Set(data.map((item) => item.pocket))]
        .map((pocket) => ({ label: ITEM_POCKETS[pocket], value: pocket }))
        .sort((a, b) => a.label.localeCompare(b.label)),
  },
  {
    id: 'category',
    label: 'Category',
    param: 'categories',
    options: (data, active) => {
      const pocketFiltered =
        active.pocket.length > 0 ? data.filter((item) => active.pocket.includes(item.pocket)) : data
      return [...new Set(pocketFiltered.map((item) => item.category))]
        .map((category) => ({
          label: ITEM_CATEGORIES[category].label,
          value: category,
        }))
        .sort((a, b) => a.label.localeCompare(b.label))
    },
  },
]

export default function ItemCardGrid({
  data,
  filterByVersionGroup = false,
  itemsPerPage = 48,
  className,
}: {
  data: ItemCardProps[]
  filterByVersionGroup?: boolean
  itemsPerPage?: number
  className?: string
}) {
  return (
    <CardGrid
      data={data}
      columns={columns}
      renderCard={(item) => <ItemCard props={item} />}
      getKey={(item) => `${item.slug}-${item.id}`}
      itemsPerPage={itemsPerPage}
      gridClassName={
        className ?? 'grid w-full grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
      }
      filters={filters}
      versionGroupPredicate={
        filterByVersionGroup
          ? (item, versionGroup) =>
              item.flavorTextEntries.some((entry) => entry.version_group?.name === versionGroup)
          : undefined
      }
    />
  )
}
