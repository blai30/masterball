import { ChartBar, Hexagon } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'

import StatsBarChart from '@/components/details/stats/StatsBarChart'
import StatsRadarChart from '@/components/details/stats/StatsRadarChart'
import { Tab, TabsList, TabsRoot } from '@/components/ui/Tabs'
import type { BaseStat } from '@/lib/domain/stats'

const LOCAL_STORAGE_KEY = 'stats-tab-index'

export default function StatsSection({ stats }: { stats: BaseStat[] }) {
  const title = 'Stats'
  const [selectedIndex, setSelectedIndex] = useState<number>(0)

  // Load tab index from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (stored !== null) {
      setSelectedIndex(Number(stored))
    }
  }, [])

  // Save tab index to localStorage on change
  const handleChange = (index: number) => {
    setSelectedIndex(index)
    localStorage.setItem(LOCAL_STORAGE_KEY, String(index))
  }

  return (
    <section className="@container/stats flex flex-col gap-4 rounded-xl p-4 inset-ring-1 inset-ring-zinc-200 dark:inset-ring-zinc-800">
      <TabsRoot value={selectedIndex} onValueChange={(value) => handleChange(Number(value))}>
        <TabsList className="mb-4">
          <h2 className="mr-3 text-xl font-medium text-black dark:text-white">{title}</h2>
          <Tab value={0} aria-label="Bar chart">
            <ChartBar />
          </Tab>
          <Tab value={1} aria-label="Radar chart">
            <Hexagon />
          </Tab>
        </TabsList>
        <div role="tabpanel" className="focus:outline-none">
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
                <StatsBarChart stats={stats} />
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
                <StatsRadarChart stats={stats} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </TabsRoot>
    </section>
  )
}
