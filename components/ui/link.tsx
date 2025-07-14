import NextLink, { type LinkProps } from 'next/link'
import React, { forwardRef } from 'react'
import * as Headless from '@headlessui/react'

const Link = forwardRef(function Link(
  props: LinkProps & React.ComponentPropsWithoutRef<'a'>,
  ref: React.ForwardedRef<HTMLAnchorElement>
) {
  return (
    <Headless.DataInteractive>
      <NextLink {...props} ref={ref} />
    </Headless.DataInteractive>
  )
})

export default Link
