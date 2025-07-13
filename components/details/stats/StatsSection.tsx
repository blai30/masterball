import type { Pokemon } from 'pokedex-promise-v2'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import { ChartBar, Hexagon } from 'lucide-react'
import StatsBarChart from '@/components/details/stats/StatsBarChart'
import StatsRadarChart from '@/components/details/stats/StatsRadarChart'

export default async function StatsSection({ pokemon }: { pokemon: Pokemon }) {
  const title = 'Stats'

  return (
    <section className="@container/stats flex flex-col gap-4 rounded-xl p-4 inset-ring-1 inset-ring-zinc-200 dark:inset-ring-zinc-800">
      <TabGroup>
        <TabList className="mb-4 flex flex-row items-center gap-1">
          <h2 className="mr-3 text-xl font-medium text-black dark:text-white">
            {title}
          </h2>
          <Tab className="rounded-md p-1.5 data-hover:inset-ring-2 data-hover:inset-ring-zinc-300 data-selected:bg-white dark:data-hover:inset-ring-zinc-700 dark:data-selected:bg-zinc-700">
            <ChartBar />
          </Tab>
          <Tab className="rounded-md p-1.5 data-hover:inset-ring-2 data-hover:inset-ring-zinc-300 data-selected:bg-white dark:data-hover:inset-ring-zinc-700 dark:data-selected:bg-zinc-700">
            <Hexagon />
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <StatsBarChart pokemon={pokemon} />
          </TabPanel>
          <TabPanel>
            <StatsRadarChart pokemon={pokemon} />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </section>
  )
}
