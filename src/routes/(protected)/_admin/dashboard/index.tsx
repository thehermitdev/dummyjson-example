import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { cartsListQueryOptions } from "#/features/carts";
import { DashboardPage } from "#/features/dashboard";
import { postsListQueryOptions } from "#/features/posts";
import { todosListQueryOptions } from "#/features/todos";
import { usersListQueryOptions } from "#/features/users";
import { RouteErrorState, RoutePendingState } from "#/shared/components/route-state";

const usersInput = { page: 1, pageSize: 5 };
const singlePage = { page: 1, pageSize: 1 };

export const Route = createFileRoute("/(protected)/_admin/dashboard/")({
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(usersListQueryOptions(usersInput)),
      context.queryClient.ensureQueryData(postsListQueryOptions(singlePage)),
      context.queryClient.ensureQueryData(cartsListQueryOptions(singlePage)),
      context.queryClient.ensureQueryData(todosListQueryOptions(singlePage)),
    ]),
  pendingComponent: () => <RoutePendingState label="Loading dashboard…" />,
  errorComponent: ({ error, reset }) => <RouteErrorState error={error} reset={reset} />,
  head: () => ({ meta: [{ title: "Dashboard · DummyJSON Admin" }] }),
  component: DashboardRoute,
});

function DashboardRoute() {
  const users = useSuspenseQuery(usersListQueryOptions(usersInput)).data;
  const posts = useSuspenseQuery(postsListQueryOptions(singlePage)).data;
  const carts = useSuspenseQuery(cartsListQueryOptions(singlePage)).data;
  const todos = useSuspenseQuery(todosListQueryOptions(singlePage)).data;

  return (
    <DashboardPage
      totals={{ users: users.total, posts: posts.total, carts: carts.total, todos: todos.total }}
      recentUsers={users.users.map(({ id, firstName, lastName, email, image }) => ({
        id,
        firstName,
        lastName,
        email,
        image,
      }))}
    />
  );
}
