'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Pokemon } from 'pokedex-promise-v2'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import { ChartBar, Hexagon } from 'lucide-react'
import StatsBarChart from '@/components/details/stats/StatsBarChart'
import StatsRadarChart from '@/components/details/stats/StatsRadarChart'

const LOCAL_STORAGE_KEY = 'stats-tab-index'

export default function StatsTabs({
  title,
  pokemon,
}: {
  title: string
  pokemon: Pokemon
}) {
  const [selectedIndex, setSelectedIndex] = useState<number>(0)

  // Load tab index from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (stored !== null) {
      setSelectedIndex(Number(stored))
    }
  }, [])

  // Save tab index to localStorage on change
  const handleChange = useCallback((index: number) => {
    setSelectedIndex(index)
    localStorage.setItem(LOCAL_STORAGE_KEY, String(index))
  }, [])

  return (
    <section className="@container/stats flex flex-col gap-4 rounded-xl p-4 inset-ring-1 inset-ring-zinc-200 dark:inset-ring-zinc-800">
      <TabGroup selectedIndex={selectedIndex} onChange={handleChange}>
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
