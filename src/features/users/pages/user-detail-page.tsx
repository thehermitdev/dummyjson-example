import type { ReactNode } from "react";

import type { User } from "../api/contracts";
import { AppLink } from "#/shared/components/navigation/app-link";

export function UserDetailPage({ user, children }: { user: User; children?: ReactNode }) {
  const params = { userId: String(user.id) };
  const tabClassName = "rounded-md border px-3 py-2 transition-colors hover:bg-muted";
  const activeProps = { className: `${tabClassName} bg-muted font-medium` };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card p-6 shadow-xs">
        <div className="flex flex-col gap-5 md:flex-row md:items-center">
          <img
            src={user.image}
            alt=""
            className="size-20 rounded-2xl border bg-muted object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-primary">User #{user.id}</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">
              {user.firstName} {user.lastName}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {user.email} · {user.phone}
            </p>
          </div>
          <span className="w-fit rounded-full bg-muted px-3 py-1 text-sm capitalize">
            {user.role}
          </span>
        </div>

        <div className="mt-6 grid gap-4 border-t pt-5 sm:grid-cols-2 lg:grid-cols-4">
          <Meta label="Company" value={user.company.name} />
          <Meta label="Department" value={user.company.department} />
          <Meta label="Title" value={user.company.title} />
          <Meta label="Age" value={String(user.age)} />
        </div>

        <nav className="mt-6 flex flex-wrap gap-2 border-t pt-5 text-sm" aria-label="User sections">
          <AppLink
            to="/users/$userId"
            params={params}
            activeOptions={{ exact: true }}
            activeProps={activeProps}
            className={tabClassName}
          >
            Overview
          </AppLink>
          <AppLink
            to="/users/$userId/posts"
            params={params}
            activeOptions={{ exact: true }}
            activeProps={activeProps}
            className={tabClassName}
          >
            Posts
          </AppLink>
          <AppLink
            to="/users/$userId/carts"
            params={params}
            activeOptions={{ exact: true }}
            activeProps={activeProps}
            className={tabClassName}
          >
            Carts
          </AppLink>
          <AppLink
            to="/users/$userId/todos"
            params={params}
            activeOptions={{ exact: true }}
            activeProps={activeProps}
            className={tabClassName}
          >
            Tasks
          </AppLink>
        </nav>
      </div>
      {children}
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  );
}
