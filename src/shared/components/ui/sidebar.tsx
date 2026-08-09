import * as React from "react";
import { PanelLeft } from "lucide-react";

import { Button } from "#/shared/components/ui/button";
import { cn } from "#/shared/lib/utils";

type SidebarContextValue = {
  open: boolean;
  openMobile: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenMobile: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

export function useSidebar() {
  const value = React.useContext(SidebarContext);
  if (!value) {
    throw new Error("useSidebar must be used within SidebarProvider");
  }
  return value;
}

export function SidebarProvider({
  children,
  defaultOpen = true,
}: React.PropsWithChildren<{ defaultOpen?: boolean }>) {
  const [open, setOpen] = React.useState(defaultOpen);
  const [openMobile, setOpenMobile] = React.useState(false);

  const toggleSidebar = React.useCallback(() => {
    if (window.matchMedia("(max-width: 767px)").matches) {
      setOpenMobile((value) => !value);
      return;
    }
    setOpen((value) => !value);
  }, []);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "b") {
        event.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggleSidebar]);

  const value = React.useMemo(
    () => ({ open, openMobile, setOpen, setOpenMobile, toggleSidebar }),
    [open, openMobile, toggleSidebar],
  );

  return (
    <SidebarContext.Provider value={value}>
      <div className="flex min-h-svh w-full bg-sidebar p-0 md:p-2">{children}</div>
    </SidebarContext.Provider>
  );
}

export function Sidebar({ children, className }: React.PropsWithChildren<{ className?: string }>) {
  const { open, openMobile, setOpenMobile } = useSidebar();

  return (
    <>
      {openMobile ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            aria-label="Close sidebar"
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpenMobile(false)}
          />
          <aside className="relative z-10 flex h-full w-[18rem] flex-col bg-sidebar text-sidebar-foreground shadow-xl">
            {children}
          </aside>
        </div>
      ) : null}

      <aside
        data-state={open ? "expanded" : "collapsed"}
        className={cn(
          "hidden h-[calc(100svh-1rem)] shrink-0 flex-col overflow-hidden rounded-xl border bg-sidebar text-sidebar-foreground shadow-sm transition-[width] duration-200 md:flex",
          open ? "w-64" : "w-16",
          className,
        )}
      >
        {children}
      </aside>
    </>
  );
}

export function SidebarInset({ className, ...props }: React.ComponentProps<"main">) {
  return (
    <main
      className={cn(
        "relative flex min-h-svh min-w-0 flex-1 flex-col bg-background md:min-h-[calc(100svh-1rem)] md:rounded-xl md:border md:shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

export function SidebarTrigger({ className }: { className?: string }) {
  const { toggleSidebar } = useSidebar();
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      className={className}
      onClick={toggleSidebar}
      aria-label="Toggle sidebar"
    >
      <PanelLeft className="size-4" />
    </Button>
  );
}

export function SidebarHeader(props: React.ComponentProps<"div">) {
  return <div {...props} className={cn("flex flex-col gap-2 p-3", props.className)} />;
}

export function SidebarContent(props: React.ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cn("flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-2", props.className)}
    />
  );
}

export function SidebarFooter(props: React.ComponentProps<"div">) {
  return <div {...props} className={cn("border-t p-3", props.className)} />;
}

export function SidebarGroup(props: React.ComponentProps<"section">) {
  return <section {...props} className={cn("space-y-1", props.className)} />;
}

export function SidebarGroupLabel(props: React.ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cn(
        "px-2 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-sidebar-foreground/55",
        props.className,
      )}
    />
  );
}

export function SidebarMenu(props: React.ComponentProps<"ul">) {
  return <ul {...props} className={cn("space-y-1", props.className)} />;
}

export function SidebarMenuItem(props: React.ComponentProps<"li">) {
  return <li {...props} className={cn("relative", props.className)} />;
}

export function SidebarMenuSub(props: React.ComponentProps<"ul">) {
  return <ul {...props} className={cn("ml-5 space-y-1 border-l pl-3", props.className)} />;
}

export function SidebarMenuSubItem(props: React.ComponentProps<"li">) {
  return <li {...props} />;
}
