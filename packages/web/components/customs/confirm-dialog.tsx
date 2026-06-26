"use client"

import * as React from "react"
import { createCallable, type UserComponent } from "react-call"
import { Dialog as DialogPrimitive } from "radix-ui"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ConfirmDialogProps = {
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
}

type ConfirmDialogRootProps = Record<string, never>

const ConfirmDialogView: UserComponent<
  ConfirmDialogProps,
  boolean,
  ConfirmDialogRootProps
> = ({
  call,
  title,
  description,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
}) => {
  const cancelButtonRef = React.useRef<HTMLButtonElement>(null)

  return (
    <DialogPrimitive.Root
      open={!call.ended}
      onOpenChange={(open) => {
        if (!open && !call.ended) {
          call.end(false)
        }
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          data-slot="confirm-dialog-overlay"
          className="fixed inset-0 z-50 bg-black/20 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0"
        />
        <DialogPrimitive.Content
          data-slot="confirm-dialog-content"
          className={cn(
            "fixed top-1/2 left-1/2 z-50 grid w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 gap-4 rounded-lg border bg-popover p-5 text-popover-foreground shadow-lg duration-200 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
          )}
          onOpenAutoFocus={(event) => {
            event.preventDefault()
            cancelButtonRef.current?.focus()
          }}
        >
          <div className="grid gap-2">
            <DialogPrimitive.Title
              data-slot="confirm-dialog-title"
              className="font-heading text-base font-medium text-foreground"
            >
              {title}
            </DialogPrimitive.Title>
            {description ? (
              <DialogPrimitive.Description
                data-slot="confirm-dialog-description"
                className="text-sm text-muted-foreground"
              >
                {description}
              </DialogPrimitive.Description>
            ) : null}
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              ref={cancelButtonRef}
              type="button"
              variant="outline"
              onClick={() => call.end(false)}
            >
              {cancelLabel}
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => call.end(true)}
            >
              {confirmLabel}
            </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

/**
 * Callable confirmation dialog that resolves to a boolean choice.
 *
 * @returns A callable dialog handle that yields `true` when confirmed and `false` otherwise.
 */
export const ConfirmDialog = createCallable<
  ConfirmDialogProps,
  boolean,
  ConfirmDialogRootProps
>(
  ConfirmDialogView,
  200
)
