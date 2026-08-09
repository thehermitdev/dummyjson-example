import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { TodosPage, todosListQueryOptions } from "#/features/todos";
import type { TodosListInput } from "#/features/todos";
import { usersDirectoryQueryOptions } from "#/features/users";
import { RouteErrorState, RoutePendingState } from "#/shared/components/route-state";

const searchSchema = z.object({ page: z.coerce.number().int().min(1).catch(1), pageSize: z.coerce.number().int().min(5).max(30).catch(10), userId: z.coerce.number().int().positive().optional().catch(undefined) });

export const Route = createFileRoute("/(protected)/_admin/todos/")({
  validateSearch: (search) => searchSchema.parse(search),
  loaderDeps: ({ search }) => search,
  loader: ({ context, deps }) => Promise.all([context.queryClient.ensureQueryData(todosListQueryOptions(deps)), context.queryClient.ensureQueryData(usersDirectoryQueryOptions())]),
  pendingComponent: () => <RoutePendingState label="Loading tasks…" />,
  errorComponent: ({ error, reset }) => <RouteErrorState error={error} reset={reset} />,
  head: () => ({ meta: [{ title: "Tasks · DummyJSON Admin" }] }),
  component: TodosRoute,
});
function TodosRoute() { const search = Route.useSearch(); const navigate = Route.useNavigate(); const todos = useSuspenseQuery(todosListQueryOptions(search)).data; const users = useSuspenseQuery(usersDirectoryQueryOptions()).data.users; const onInputChange = (next: Partial<TodosListInput>) => void navigate({ search: (previous) => ({ ...previous, ...next }) }); return <TodosPage data={todos} input={search} users={users} onInputChange={onInputChange} />; }
