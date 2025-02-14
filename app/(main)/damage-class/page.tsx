import { Metadata } from 'next'
import { DamageClassName } from '@/lib/utils/pokeapiHelpers'
import DamageClassPill from '@/components/DamageClassPill'

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
  const damageClassNames = Object.values(DamageClassName)

  return (
    <div className="container mx-auto">
      <ul className="flex flex-col gap-2">
        {damageClassNames.map((damageClass) => (
          <li key={damageClass}>
            <DamageClassPill variant={damageClass} size="large" />
          </li>
        ))}
      </ul>
    </div>
  )
}
