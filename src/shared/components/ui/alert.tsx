import * as React from "react";

import { cn } from "#/shared/lib/utils";

export function Alert({
  variant = "default",
  className,
  ...props
}: React.ComponentProps<"div"> & { variant?: "default" | "destructive" | "warning" }) {
  return (
    <div
      role="alert"
      {...props}
      className={cn(
        "grid w-full gap-1 rounded-lg border px-4 py-3 text-sm",
        variant === "destructive" && "border-destructive/30 bg-destructive/5 text-destructive",
        variant === "warning" &&
          "border-amber-500/30 bg-amber-500/10 text-amber-950 dark:text-amber-100",
        className,
      )}
    />
  );
}

export function AlertTitle(props: React.ComponentProps<"h5">) {
  return <h5 {...props} className={cn("font-medium", props.className)} />;
}

export function AlertDescription(props: React.ComponentProps<"div">) {
  return <div {...props} className={cn("text-sm opacity-90", props.className)} />;
}
