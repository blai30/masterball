'use client'

import Image from 'next/image'

export default function LoadingCard() {
  const id = 0
  const imageUrl =
    'https://resource.pokemon-home.com/battledata/img/pokei128/icon0000_f00_s0.png'

  return (
    <>
      <div
        aria-hidden="true"
        className="absolute inset-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900"
      >
        <div className="absolute inset-0 overflow-hidden group-hover:opacity-75">
          <Image
            src={imageUrl}
            alt="Loading card image"
            width={128}
            height={128}
            priority
            className="size-full object-contain p-6"
          />
        </div>
        {/* <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50" /> */}
      </div>
      <div className="absolute inset-0 flex flex-col items-start justify-between rounded-lg p-4 overflow-hidden">
        <p aria-hidden="true" className="text-sm text-zinc-300 font-mono">
          {id}
        </p>
        <div className="flex flex-col gap-1 animate-pulse">
          <div className="h-2 w-12 m-1 bg-zinc-700/60 rounded-sm"></div>
          <div className="h-4 w-20 m-1 bg-zinc-700/60 rounded-sm"></div>
        </div>
      </div>
    </>
  )
}
