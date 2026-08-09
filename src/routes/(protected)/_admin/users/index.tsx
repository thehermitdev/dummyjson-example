import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import type { UsersListInput } from "#/features/users";
import { UsersPage, usersListQueryOptions } from "#/features/users";
import { RouteErrorState, RoutePendingState } from "#/shared/components/route-state";

const searchSchema = z.object({
  page: z.coerce.number().int().min(1).catch(1),
  pageSize: z.coerce.number().int().min(5).max(30).catch(10),
  q: z.string().trim().max(100).optional().catch(undefined),
  filterKey: z.enum(["hair.color", "role", "gender"]).optional().catch(undefined),
  filterValue: z.string().trim().max(100).optional().catch(undefined),
  sortBy: z.enum(["firstName", "lastName", "age", "email"]).optional().catch(undefined),
  order: z.enum(["asc", "desc"]).catch("asc"),
});

export const Route = createFileRoute("/(protected)/_admin/users/")({
  validateSearch: (search) => searchSchema.parse(search),
  loaderDeps: ({ search }) => search,
  loader: ({ context, deps }) => context.queryClient.ensureQueryData(usersListQueryOptions(deps)),
  pendingComponent: () => <RoutePendingState label="Loading users…" />,
  errorComponent: ({ error, reset }) => <RouteErrorState error={error} reset={reset} />,
  head: () => ({ meta: [{ title: "Users · DummyJSON Admin" }] }),
  component: UsersRoute,
});

function UsersRoute() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const { data } = useSuspenseQuery(usersListQueryOptions(search));

  const onInputChange = (next: Partial<UsersListInput>) => {
    void navigate({
      search: (previous) => ({
        ...previous,
        ...(next.page !== undefined ? { page: next.page } : {}),
        ...(next.pageSize !== undefined ? { pageSize: next.pageSize } : {}),
        ...("q" in next ? { q: next.q } : {}),
        ...("filterKey" in next ? { filterKey: next.filterKey } : {}),
        ...("filterValue" in next ? { filterValue: next.filterValue } : {}),
        ...("sortBy" in next ? { sortBy: next.sortBy } : {}),
        ...(next.order !== undefined ? { order: next.order } : {}),
      }),
    });
  };

  return <UsersPage data={data} input={search} onInputChange={onInputChange} />;
}
