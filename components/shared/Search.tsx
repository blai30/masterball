'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import clsx from 'clsx/lite'
import { SearchItem, useSearch } from '@/components/shared/SearchProvider'
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Dialog,
  DialogBackdrop,
  DialogPanel,
} from '@headlessui/react'

export default function Search() {
  const [open, setOpen] = useState(true)
  const { items, query, setQuery } = useSearch()
  const router = useRouter()

  return (
    <Dialog
      className="relative z-10"
      open={open}
      onClose={() => {
        setOpen(false)
        setQuery('')
      }}
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-white/50 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in dark:bg-black/50"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto p-4 sm:p-6 md:p-20">
        <DialogPanel
          transition
          className="mx-auto max-w-3xl transform divide-y divide-gray-100 overflow-hidden rounded-xl bg-white ring-1 shadow-2xl ring-black/5 transition-all data-closed:scale-95 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        >
          <Combobox<SearchItem>
            onChange={(item: SearchItem) => {
              if (item) {
                router.push(item.path)
                setOpen(false)
              }
            }}
          >
            {({ activeOption }: { activeOption: SearchItem | null }) => (
              <>
                <div className="grid grid-cols-1">
                  <ComboboxInput
                    autoFocus
                    className="col-start-1 row-start-1 h-12 w-full pr-4 pl-11 text-base text-gray-900 outline-hidden placeholder:text-gray-400 sm:text-sm"
                    placeholder="Search..."
                    onChange={(event) => setQuery(event.target.value)}
                    onBlur={() => setQuery('')}
                  />
                  <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    aria-hidden="true"
                    className="pointer-events-none col-start-1 row-start-1 ml-4 size-5 self-center text-gray-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                  </svg>
                </div>

                {(query === '' || items.length > 0) && (
                  <ComboboxOptions
                    as="div"
                    static
                    hold
                    className="flex transform-gpu divide-x divide-gray-100"
                  >
                    <div
                      className={clsx(
                        'max-h-96 min-w-0 flex-auto scroll-py-4 overflow-y-auto px-6 py-4'
                      )}
                    >
                      {query === '' && (
                        <h2 className="mt-2 mb-4 text-xs font-semibold text-gray-500">
                          Recent searches
                        </h2>
                      )}
                      <div className="-mx-2 text-sm text-gray-700">
                        {items.map((item: SearchItem) => (
                          <ComboboxOption
                            as="div"
                            key={item.path}
                            value={item}
                            className="group flex cursor-default items-center rounded-md p-2 select-none data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                          >
                            <img
                              src={item.imageUrl}
                              alt=""
                              className="size-6 flex-none rounded-full"
                            />
                            <span className="ml-3 flex-auto truncate">
                              {item.title}
                            </span>
                            <svg
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              aria-hidden="true"
                              className="ml-3 hidden size-5 flex-none text-gray-400 group-data-focus:block"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m8.25 4.5 7.5 7.5-7.5 7.5"
                              />
                            </svg>
                          </ComboboxOption>
                        ))}
                      </div>
                    </div>

                    {activeOption !== null && activeOption !== undefined && (
                      <div className="hidden h-96 w-1/2 flex-none flex-col divide-y divide-gray-100 overflow-y-auto sm:flex">
                        <div className="flex-none p-6 text-center">
                          <div className="mx-auto flex w-full flex-col items-center">
                            <Image
                              src={activeOption.imageUrl}
                              alt={activeOption.slug}
                              width={128}
                              height={128}
                              priority
                              className="size-16 min-w-full object-scale-down"
                            />
                          </div>
                          <h2 className="mt-3 font-semibold text-gray-900">
                            {activeOption.title}
                          </h2>
                          <p className="text-sm/6 text-gray-500">
                            {activeOption.keywords
                              .map((keyword) => keyword)
                              .join(', ')}
                          </p>
                        </div>
                        <div className="flex flex-auto flex-col justify-between p-6">
                          <dl className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm text-gray-700">
                            <dt className="col-end-1 font-semibold text-gray-900">
                              Phone
                            </dt>
                            <dd>{activeOption.id}</dd>
                            <dt className="col-end-1 font-semibold text-gray-900">
                              Path
                            </dt>
                            <dd className="truncate">
                              <Link
                                href={`/${activeOption.path}`}
                                className="text-indigo-600 underline"
                              >
                                {`/${activeOption.path}`}
                              </Link>
                            </dd>
                            <dt className="col-end-1 font-semibold text-gray-900">
                              Email
                            </dt>
                            <dd className="truncate">
                              <a
                                href={`mailto:#`}
                                className="text-indigo-600 underline"
                              >
                                {`${activeOption.path}@gmail.com`}
                              </a>
                            </dd>
                          </dl>
                          <button
                            type="button"
                            className="mt-6 w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          >
                            Send message
                          </button>
                        </div>
                      </div>
                    )}
                  </ComboboxOptions>
                )}

                {query !== '' && items.length === 0 && (
                  <div className="px-6 py-14 text-center text-sm sm:px-14">
                    <p className="mt-4 font-semibold text-gray-900">
                      No people found
                    </p>
                    <p className="mt-2 text-gray-500">
                      We couldn’t find anything with that term. Please try
                      again.
                    </p>
                  </div>
                )}
              </>
            )}
          </Combobox>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
