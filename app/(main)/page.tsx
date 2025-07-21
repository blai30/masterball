import { Metadata } from 'next'
import dataService from '@/lib/services/dataService'
import SpeciesCardGrid from '@/components/compounds/SpeciesCardGrid'

export const dynamic = 'force-static'
export const dynamicParams = false

export async function generateMetadata(): Promise<Metadata> {
  const metadata: Metadata = {
    title: 'Pokemon List',
    twitter: {
      card: 'summary',
    },
  }

  return metadata
}

export default async function Home() {
  // Use the shared data service - this will be cached and shared
  const speciesData = await dataService.getSpeciesGridData()

  return (
    <div className="mx-auto max-w-[96rem]">
      <SpeciesCardGrid data={speciesData} />
    </div>
  )
}
