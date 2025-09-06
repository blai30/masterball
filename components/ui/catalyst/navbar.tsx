'use client'

import type React from 'react'
import { forwardRef, useId } from 'react'
import clsx from 'clsx/lite'
import { LayoutGroup, motion } from 'motion/react'
import * as Headless from '@headlessui/react'
import { TouchTarget } from '@/components/ui/catalyst/button'
import Link from '@/components/ui/catalyst/link'

export function Navbar({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'nav'>) {
  return (
    <nav
      {...props}
      className={clsx(className, 'flex flex-1 items-center gap-4 py-2.5')}
    />
  )
}

export function NavbarDivider({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      aria-hidden="true"
      {...props}
      className={clsx(className, 'h-6 w-px bg-zinc-950/10 dark:bg-white/10')}
    />
  )
}

export function NavbarSection({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const id = useId()

  return (
    <LayoutGroup id={id}>
      <div {...props} className={clsx(className, 'flex items-center gap-3')} />
    </LayoutGroup>
  )
}

export function NavbarSpacer({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      aria-hidden="true"
      {...props}
      className={clsx(className, '-ml-4 flex-1')}
    />
  )
}

type NavbarItemBaseProps = {
  current?: boolean
  className?: string
  children: React.ReactNode
}

type NavbarItemLinkProps = NavbarItemBaseProps &
  Omit<React.ComponentPropsWithoutRef<typeof Link>, 'className'>

type NavbarItemButtonProps = NavbarItemBaseProps &
  Omit<Headless.ButtonProps<'button'>, 'as' | 'className'>

type NavbarItemProps = NavbarItemLinkProps | NavbarItemButtonProps

export const NavbarItem = forwardRef<
  HTMLAnchorElement | HTMLButtonElement,
  NavbarItemProps
>(function NavbarItem({ current, className, children, ...props }, ref) {
  const classes = clsx(
    // Base
    'relative flex min-w-0 items-center gap-3 rounded-lg p-2 text-left text-base/6 font-medium text-zinc-950 sm:text-sm/5',
    // Leading icon/icon-only
    '*:data-[slot=icon]:size-6 *:data-[slot=icon]:shrink-0 *:data-[slot=icon]:fill-zinc-500 sm:*:data-[slot=icon]:size-5',
    // Trailing icon (down chevron or similar)
    '*:not-nth-2:last:data-[slot=icon]:ml-auto *:not-nth-2:last:data-[slot=icon]:size-5 sm:*:not-nth-2:last:data-[slot=icon]:size-4',
    // Avatar
    '*:data-[slot=avatar]:-m-0.5 *:data-[slot=avatar]:size-7 *:data-[slot=avatar]:[--avatar-radius:var(--radius-md)] sm:*:data-[slot=avatar]:size-6',
    // Hover
    'data-hover:bg-zinc-950/10 data-hover:*:data-[slot=icon]:fill-zinc-950',
    // Active
    'data-active:bg-zinc-950/10 data-active:*:data-[slot=icon]:fill-zinc-950',
    // Dark mode
    'dark:text-white dark:*:data-[slot=icon]:fill-zinc-400',
    'dark:data-hover:bg-white/10 dark:data-hover:*:data-[slot=icon]:fill-white',
    'dark:data-active:bg-white/10 dark:data-active:*:data-[slot=icon]:fill-white',
    // Transitions
    'transition-colors data-hover:duration-0'
  )

  return (
    <span className={clsx(className, 'relative')}>
      {current && (
        <motion.span
          layoutId="current-indicator"
          className="absolute inset-x-2 -bottom-2.5 h-0.5 rounded-full bg-zinc-950 dark:bg-white"
          transition={{ type: 'spring', bounce: 0.3, duration: 0.4 }}
        />
      )}
      {'href' in props ? (
        <Link
          {...(props as NavbarItemLinkProps)}
          className={classes}
          data-current={current ? 'true' : undefined}
          ref={ref as React.ForwardedRef<HTMLAnchorElement>}
        >
          <TouchTarget>{children}</TouchTarget>
        </Link>
      ) : (
        <Headless.Button
          {...(props as NavbarItemButtonProps)}
          className={clsx('cursor-default', classes)}
          data-current={current ? 'true' : undefined}
          ref={ref as React.ForwardedRef<HTMLButtonElement>}
        >
          <TouchTarget>{children}</TouchTarget>
        </Headless.Button>
      )}
    </span>
  )
})

export function NavbarLabel({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'span'>) {
  return <span {...props} className={clsx(className, 'truncate')} />
}
