import * as React from "react";
import { ChevronRight, MoreHorizontal } from "lucide-react";

import { cn } from "#/shared/lib/utils";

export function Breadcrumb(props: React.ComponentProps<"nav">) {
  return <nav aria-label="breadcrumb" {...props} />;
}

export function BreadcrumbList(props: React.ComponentProps<"ol">) {
  return (
    <ol
      {...props}
      className={cn("flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground", props.className)}
    />
  );
}

export function BreadcrumbItem(props: React.ComponentProps<"li">) {
  return <li {...props} className={cn("inline-flex items-center gap-1.5", props.className)} />;
}

export function BreadcrumbLink(props: React.ComponentProps<"a">) {
  return (
    <a
      {...props}
      className={cn("transition-colors hover:text-foreground", props.className)}
    />
  );
}

export function BreadcrumbPage(props: React.ComponentProps<"span">) {
  return <span {...props} aria-current="page" className={cn("font-medium text-foreground", props.className)} />;
}

export function BreadcrumbSeparator({ children, ...props }: React.ComponentProps<"li">) {
  return (
    <li aria-hidden="true" {...props} className={cn("[&>svg]:size-3.5", props.className)}>
      {children ?? <ChevronRight />}
    </li>
  );
}

export function BreadcrumbEllipsis(props: React.ComponentProps<"span">) {
  return (
    <span {...props} className={cn("flex size-7 items-center justify-center", props.className)}>
      <MoreHorizontal className="size-4" />
      <span className="sr-only">More</span>
    </span>
  );
}
