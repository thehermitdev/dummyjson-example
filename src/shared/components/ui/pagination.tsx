import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

import { cn } from "#/shared/lib/utils";

export function Pagination(props: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      {...props}
      className={cn("mx-auto flex w-full justify-center", props.className)}
    />
  );
}

export function PaginationContent(props: React.ComponentProps<"ul">) {
  return <ul {...props} className={cn("flex items-center gap-1", props.className)} />;
}

export function PaginationItem(props: React.ComponentProps<"li">) {
  return <li {...props} />;
}

export function PaginationButton({
  active,
  className,
  ...props
}: React.ComponentProps<"button"> & { active?: boolean }) {
  return (
    <button
      type="button"
      aria-current={active ? "page" : undefined}
      {...props}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-md text-sm transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-50",
        active ? "border bg-background font-medium shadow-xs" : "text-muted-foreground",
        className,
      )}
    />
  );
}

export function PaginationPrevious(props: React.ComponentProps<typeof PaginationButton>) {
  return (
    <PaginationButton {...props} className={cn("w-auto gap-1 px-2.5", props.className)}>
      <ChevronLeft className="size-4" />
      <span className="hidden sm:inline">Previous</span>
    </PaginationButton>
  );
}

export function PaginationNext(props: React.ComponentProps<typeof PaginationButton>) {
  return (
    <PaginationButton {...props} className={cn("w-auto gap-1 px-2.5", props.className)}>
      <span className="hidden sm:inline">Next</span>
      <ChevronRight className="size-4" />
    </PaginationButton>
  );
}

export function PaginationEllipsis() {
  return (
    <span className="flex size-9 items-center justify-center text-muted-foreground">
      <MoreHorizontal className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}
