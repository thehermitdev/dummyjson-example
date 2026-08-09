import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { TodoDetailPage, todoDetailQueryOptions } from "#/features/todos";
import { usersDirectoryQueryOptions } from "#/features/users";
import { RouteErrorState, RoutePendingState } from "#/shared/components/route-state";
import { parseNumericId } from "#/shared/lib/route-params";

export const Route = createFileRoute("/(protected)/_admin/todos/$todoId")({
  loader: ({ context, params }) => { const todoId = parseNumericId(params.todoId, "task id"); return Promise.all([context.queryClient.ensureQueryData(todoDetailQueryOptions(todoId)), context.queryClient.ensureQueryData(usersDirectoryQueryOptions())]); },
  pendingComponent: () => <RoutePendingState label="Loading task…" />,
  errorComponent: ({ error, reset }) => <RouteErrorState error={error} reset={reset} />,
  component: TodoRoute,
});
function TodoRoute() { const { todoId: value } = Route.useParams(); const todoId = parseNumericId(value, "task id"); const todo = useSuspenseQuery(todoDetailQueryOptions(todoId)).data; const users = useSuspenseQuery(usersDirectoryQueryOptions()).data.users; const assignee = users.find((user) => user.id === todo.userId); return <TodoDetailPage todo={todo} assignee={assignee ? `${assignee.firstName} ${assignee.lastName}` : `User #${todo.userId}`} />; }
