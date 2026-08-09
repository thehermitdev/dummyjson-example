import * as React from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  CheckSquare2,
  ChevronRight,
  FileText,
  LayoutDashboard,
  PackageOpen,
  ShoppingCart,
  UsersRound,
} from "lucide-react";

import { ClerkProfile } from "#/app/auth/clerk-profile";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  useSidebar,
} from "#/shared/components/ui/sidebar";
import { cn } from "#/shared/lib/utils";

const modules = [
  {
    title: "Overview",
    icon: LayoutDashboard,
    items: [{ label: "Dashboard", to: "/dashboard" as const }],
  },
  {
    title: "User Management",
    icon: UsersRound,
    items: [{ label: "Users", to: "/users" as const }],
  },
  {
    title: "Content",
    icon: FileText,
    items: [
      { label: "Posts", to: "/posts" as const },
      { label: "Tags", to: "/posts/tags" as const },
    ],
  },
  {
    title: "Commerce",
    icon: ShoppingCart,
    items: [{ label: "Carts", to: "/carts" as const }],
  },
  {
    title: "Task Management",
    icon: CheckSquare2,
    items: [{ label: "Tasks", to: "/todos" as const }],
  },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const { open, setOpenMobile } = useSidebar();
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>(() =>
    Object.fromEntries(modules.map((module) => [module.title, true])),
  );

  return (
    <Sidebar>
      <SidebarHeader>
        <Link
          to="/dashboard"
          onClick={() => setOpenMobile(false)}
          className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-sidebar-accent"
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <PackageOpen className="size-4" />
          </span>
          {open ? (
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold">DummyJSON Admin</span>
              <span className="block truncate text-xs text-sidebar-foreground/60">
                Backoffice Console
              </span>
            </span>
          ) : null}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{open ? "Modules" : ""}</SidebarGroupLabel>
          <SidebarMenu>
            {modules.map((module) => {
              const active = module.items.some(
                (item) => pathname === item.to || pathname.startsWith(`${item.to}/`),
              );
              const Icon = module.icon;
              return (
                <SidebarMenuItem key={module.title}>
                  <button
                    type="button"
                    onClick={() =>
                      setExpanded((value) => ({
                        ...value,
                        [module.title]: !value[module.title],
                      }))
                    }
                    className={cn(
                      "flex h-9 w-full items-center gap-3 rounded-md px-2 text-left text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      active && "bg-sidebar-accent text-sidebar-accent-foreground",
                      !open && "justify-center",
                    )}
                    title={!open ? module.title : undefined}
                  >
                    <Icon className="size-4 shrink-0" />
                    {open ? <span className="min-w-0 flex-1 truncate">{module.title}</span> : null}
                    {open ? (
                      <ChevronRight
                        className={cn(
                          "size-4 transition-transform",
                          expanded[module.title] && "rotate-90",
                        )}
                      />
                    ) : null}
                  </button>
                  {open && expanded[module.title] ? (
                    <SidebarMenuSub>
                      {module.items.map((item) => (
                        <SidebarMenuSubItem key={item.to}>
                          <Link
                            to={item.to}
                            onClick={() => setOpenMobile(false)}
                            className={cn(
                              "block rounded-md px-2 py-1.5 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                              (pathname === item.to || pathname.startsWith(`${item.to}/`)) &&
                                "bg-sidebar-accent font-medium text-sidebar-accent-foreground",
                            )}
                          >
                            {item.label}
                          </Link>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  ) : null}
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <ClerkProfile compact={!open} />
      </SidebarFooter>
    </Sidebar>
  );
}
