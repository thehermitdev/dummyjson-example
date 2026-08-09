import * as React from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { X } from "lucide-react";

import { cn } from "#/shared/lib/utils";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export function DialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Popup>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/50 transition-opacity data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
      <DialogPrimitive.Viewport className="fixed inset-0 z-50 grid place-items-center overflow-y-auto p-4">
        <DialogPrimitive.Popup
          {...props}
          className={cn(
            "relative w-full max-w-lg rounded-xl border bg-background p-6 shadow-xl outline-none transition data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
            className,
          )}
        >
          {children}
          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground">
            <X className="size-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Viewport>
    </DialogPrimitive.Portal>
  );
}

export function DialogHeader(props: React.ComponentProps<"div">) {
  return <div {...props} className={cn("space-y-1.5 text-left", props.className)} />;
}

export function DialogFooter(props: React.ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cn("mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", props.className)}
    />
  );
}

export function DialogTitle(props: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title {...props} className={cn("text-lg font-semibold", props.className)} />
  );
}

export function DialogDescription(props: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      {...props}
      className={cn("text-sm text-muted-foreground", props.className)}
    />
  );
}
