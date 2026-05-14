import * as Headless from '@headlessui/react'
import type React from 'react'
import { forwardRef } from 'react'

const Link = forwardRef(function Link(
  props: React.ComponentPropsWithoutRef<'a'>,
  ref: React.ForwardedRef<HTMLAnchorElement>
) {
  return (
    <Headless.DataInteractive>
      <a {...props} ref={ref} />
    </Headless.DataInteractive>
  )
})

export default Link
