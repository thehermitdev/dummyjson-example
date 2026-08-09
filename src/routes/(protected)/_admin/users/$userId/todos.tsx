import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { UserTodosPanel, userTodosQueryOptions } from "#/features/users";
import { RouteErrorState, RoutePendingState } from "#/shared/components/route-state";
import { parseNumericId } from "#/shared/lib/route-params";

export const Route = createFileRoute("/(protected)/_admin/users/$userId/todos")({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(
      userTodosQueryOptions(parseNumericId(params.userId, "user id")),
    ),
  pendingComponent: () => <RoutePendingState label="Loading user tasks…" />,
  errorComponent: ({ error, reset }) => <RouteErrorState error={error} reset={reset} />,
  component: UserTodosRoute,
});
function UserTodosRoute() {
  const { userId } = Route.useParams();
  const { data } = useSuspenseQuery(userTodosQueryOptions(parseNumericId(userId, "user id")));
  return <UserTodosPanel data={data} />;
}
