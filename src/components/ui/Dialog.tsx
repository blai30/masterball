import { Dialog as BaseDialog } from '@base-ui/react/dialog'
import clsx from 'clsx/lite'
import type { ComponentPropsWithoutRef } from 'react'

export const DialogRoot = BaseDialog.Root
export const DialogPortal = BaseDialog.Portal
export const DialogClose = BaseDialog.Close
export const DialogTitle = BaseDialog.Title

export function DialogBackdrop({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof BaseDialog.Backdrop>) {
  return (
    <BaseDialog.Backdrop
      {...props}
      className={clsx(
        'fixed inset-0 bg-black/30 transition-opacity duration-300 data-ending-style:opacity-0 data-starting-style:opacity-0',
        className
      )}
    />
  )
}

export function DialogPanel({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof BaseDialog.Popup>) {
  return (
    <BaseDialog.Popup
      {...props}
      className={clsx(
        'fixed inset-y-0 left-0 w-full max-w-80 p-2 transition-transform duration-300 ease-in-out data-ending-style:-translate-x-full data-starting-style:-translate-x-full',
        className
      )}
    />
  )
}
