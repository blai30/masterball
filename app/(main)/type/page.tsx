import { Metadata } from 'next'
import TypePill from '@/components/TypePill'
import { TypeName } from '@/lib/utils/pokeapiHelpers'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const metadata: Metadata = {
    title: 'Home',
    twitter: {
      card: 'summary',
    },
  }

  return metadata
}

export default async function Page() {
  const typeNames = Object.values(TypeName)

  return (
    <div className="container mx-auto">
      <ul className="flex flex-col gap-2">
        {typeNames.map((type) => (
          <li key={type}>
            <TypePill variant={type} size="large" />
          </li>
        ))}
      </ul>
    </div>
  )
}
