import type { ReactNode } from "react";

import { AppBreadcrumb } from "#/app/shell/app-breadcrumb";
import { AppSidebar } from "#/app/shell/app-sidebar";
import { ModeToggle } from "#/shared/theme/mode-toggle";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "#/shared/components/ui/sidebar";

export function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b bg-background/90 px-4 backdrop-blur">
          <SidebarTrigger className="-ml-1" />
          <div className="h-4 w-px bg-border" />
          <div className="min-w-0 flex-1 overflow-hidden">
            <AppBreadcrumb />
          </div>
          <ModeToggle />
        </header>
        <div className="flex-1 p-4 md:p-6 lg:p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
