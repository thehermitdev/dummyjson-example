import * as React from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { X } from "lucide-react";

import { cn } from "#/shared/lib/utils";

export const Drawer = DialogPrimitive.Root;
export const DrawerTrigger = DialogPrimitive.Trigger;
export const DrawerClose = DialogPrimitive.Close;

export function DrawerContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Popup>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/50 transition-opacity data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
      <DialogPrimitive.Viewport className="fixed inset-0 z-50 flex justify-end">
        <DialogPrimitive.Popup
          {...props}
          className={cn(
            "relative flex h-full w-full max-w-xl flex-col border-l bg-background shadow-2xl outline-none transition-transform duration-200 data-[ending-style]:translate-x-full data-[starting-style]:translate-x-full",
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

export function DrawerHeader(props: React.ComponentProps<"div">) {
  return <div {...props} className={cn("border-b p-6 pr-12", props.className)} />;
}

export function DrawerBody(props: React.ComponentProps<"div">) {
  return <div {...props} className={cn("min-h-0 flex-1 overflow-y-auto p-6", props.className)} />;
}

export function DrawerFooter(props: React.ComponentProps<"div">) {
  return <div {...props} className={cn("flex justify-end gap-2 border-t p-6", props.className)} />;
}

export function DrawerTitle(props: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title {...props} className={cn("text-lg font-semibold", props.className)} />;
}

export function DrawerDescription(props: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return <DialogPrimitive.Description {...props} className={cn("mt-1 text-sm text-muted-foreground", props.className)} />;
}
