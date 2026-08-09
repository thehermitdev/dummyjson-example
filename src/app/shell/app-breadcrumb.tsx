import { useRouterState } from "@tanstack/react-router";

import { AppLink } from "#/shared/components/navigation/app-link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "#/shared/components/ui/breadcrumb";

const labels: Record<string, string> = {
  dashboard: "Dashboard",
  users: "Users",
  posts: "Posts",
  carts: "Carts",
  todos: "Tasks",
  tags: "Tags",
};

function labelFor(segment: string) {
  if (labels[segment]) return labels[segment];
  if (/^\d+$/.test(segment)) return `#${segment}`;
  return segment.replace(/-/g, " ").replace(/^./, (value) => value.toUpperCase());
}

export function AppBreadcrumb() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((segment, index) => {
          const to = `/${segments.slice(0, index + 1).join("/")}`;
          const current = index === segments.length - 1;
          return (
            <span className="contents" key={to}>
              {index > 0 ? <BreadcrumbSeparator /> : null}
              <BreadcrumbItem>
                {current ? (
                  <BreadcrumbPage>{labelFor(segment)}</BreadcrumbPage>
                ) : (
                  <AppLink to={to as never} className="transition-colors hover:text-foreground">
                    {labelFor(segment)}
                  </AppLink>
                )}
              </BreadcrumbItem>
            </span>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
