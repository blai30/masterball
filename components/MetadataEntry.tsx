'use client'

export default function MetadataEntry({
  title,
  children,
}: Readonly<{
  title: string
  children: React.ReactNode
}>) {
  return (
    <div className="flex flex-col gap-2 rounded-lg p-4">
      <p className="text-sm/6 text-zinc-600 dark:text-zinc-400">{title}</p>
      {children}
    </div>
  )
}
