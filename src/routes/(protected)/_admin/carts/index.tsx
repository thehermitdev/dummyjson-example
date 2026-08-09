import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { CartsPage, cartsListQueryOptions } from "#/features/carts";
import type { CartsListInput } from "#/features/carts";
import { usersDirectoryQueryOptions } from "#/features/users";
import { RouteErrorState, RoutePendingState } from "#/shared/components/route-state";

const searchSchema = z.object({
  page: z.coerce.number().int().min(1).catch(1),
  pageSize: z.coerce.number().int().min(5).max(30).catch(10),
  userId: z.coerce.number().int().positive().optional().catch(undefined),
});

export const Route = createFileRoute("/(protected)/_admin/carts/")({
  validateSearch: (search) => searchSchema.parse(search),
  loaderDeps: ({ search }) => search,
  loader: ({ context, deps }) =>
    Promise.all([
      context.queryClient.ensureQueryData(cartsListQueryOptions(deps)),
      context.queryClient.ensureQueryData(usersDirectoryQueryOptions()),
    ]),
  pendingComponent: () => <RoutePendingState label="Loading carts…" />,
  errorComponent: ({ error, reset }) => <RouteErrorState error={error} reset={reset} />,
  head: () => ({ meta: [{ title: "Carts · DummyJSON Admin" }] }),
  component: CartsRoute,
});
function CartsRoute() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const carts = useSuspenseQuery(cartsListQueryOptions(search)).data;
  const users = useSuspenseQuery(usersDirectoryQueryOptions()).data.users;
  const onInputChange = (next: Partial<CartsListInput>) =>
    void navigate({ search: (previous) => ({ ...previous, ...next }) });
  return <CartsPage data={carts} input={search} users={users} onInputChange={onInputChange} />;
}
