'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { Pokemon } from 'pokedex-promise-v2'
import { Tab, TabGroup, TabList, TabPanels } from '@headlessui/react'
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
          <Tab
            id="tab-bar"
            className="rounded-md p-1.5 data-hover:inset-ring-2 data-hover:inset-ring-zinc-300 data-selected:bg-zinc-300 dark:data-hover:inset-ring-zinc-700 dark:data-selected:bg-zinc-700"
            aria-controls="tabpanel-bar"
          >
            <ChartBar />
          </Tab>
          <Tab
            id="tab-radar"
            className="rounded-md p-1.5 data-hover:inset-ring-2 data-hover:inset-ring-zinc-300 data-selected:bg-zinc-300 dark:data-hover:inset-ring-zinc-700 dark:data-selected:bg-zinc-700"
            aria-controls="tabpanel-radar"
          >
            <Hexagon />
          </Tab>
        </TabList>
        <TabPanels>
          <div
            id={selectedIndex === 0 ? 'tabpanel-bar' : 'tabpanel-radar'}
            role="tabpanel"
            aria-labelledby={selectedIndex === 0 ? 'tab-bar' : 'tab-radar'}
            className="focus:outline-none"
          >
            <AnimatePresence mode="wait" initial={false}>
              {selectedIndex === 0 ? (
                <motion.div
                  key="bar"
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                >
                  <StatsBarChart pokemon={pokemon} />
                </motion.div>
              ) : (
                <motion.div
                  key="radar"
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                >
                  <StatsRadarChart pokemon={pokemon} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </TabPanels>
      </TabGroup>
    </section>
  )
}
