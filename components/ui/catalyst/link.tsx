import type { Route } from 'next'
import NextLink, { type LinkProps } from 'next/link'
import type React from 'react'
import { forwardRef } from 'react'
import * as Headless from '@headlessui/react'

const Link = forwardRef(function Link(
  props: LinkProps<Route> & React.ComponentPropsWithoutRef<'a'>,
  ref: React.ForwardedRef<HTMLAnchorElement>
) {
  return (
    <Headless.DataInteractive>
      <NextLink {...props} ref={ref} />
    </Headless.DataInteractive>
  )
})

export default Link
