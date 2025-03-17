import { Metadata } from 'next'
import MonsterCardGrid from '@/components/MonsterCardGrid'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { getSpeciesData } from '@/lib/api/query-fetchers'

export const dynamic = 'force-static'

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
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['species-list'],
    queryFn: getSpeciesData,
  })

  return (
    <div className="container mx-auto px-4">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <MonsterCardGrid />
      </HydrationBoundary>
    </div>
  )
}
