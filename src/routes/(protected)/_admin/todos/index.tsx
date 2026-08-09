import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import type { TodosListInput } from "#/features/todos";
import { TodosPage, todosListQueryOptions } from "#/features/todos";
import { usersDirectoryQueryOptions } from "#/features/users";
import { TablePageSkeleton } from "#/shared/components/api-skeletons";
import { RouteErrorState } from "#/shared/components/route-state";

const searchSchema = z.object({
  page: z.coerce.number().int().min(1).catch(1),
  pageSize: z.coerce.number().int().min(5).max(30).catch(10),
  userId: z.coerce.number().int().positive().optional().catch(undefined),
});

export const Route = createFileRoute("/(protected)/_admin/todos/")({
  validateSearch: (search) => searchSchema.parse(search),
  loaderDeps: ({ search }) => search,
  loader: ({ context, deps }) => {
    void context.queryClient.prefetchQuery(todosListQueryOptions(deps));
    void context.queryClient.prefetchQuery(usersDirectoryQueryOptions());
  },
  errorComponent: ({ error, reset }) => <RouteErrorState error={error} reset={reset} />,
  head: () => ({ meta: [{ title: "Tasks · DummyJSON Admin" }] }),
  component: TodosRoute,
});

function TodosRoute() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const todosQuery = useQuery(todosListQueryOptions(search));
  const usersQuery = useQuery(usersDirectoryQueryOptions());

  const onInputChange = useCallback(
    (next: Partial<TodosListInput>) => {
      void navigate({ search: (previous) => ({ ...previous, ...next }) });
    },
    [navigate],
  );

  const error = todosQuery.error ?? usersQuery.error;
  if (!todosQuery.data || !usersQuery.data) {
    if (error) throw error;
    return <TablePageSkeleton columns={4} />;
  }

  return (
    <TodosPage
      data={todosQuery.data}
      input={search}
      users={usersQuery.data.users}
      isFetching={todosQuery.isFetching || usersQuery.isFetching}
      onInputChange={onInputChange}
    />
  );
}
