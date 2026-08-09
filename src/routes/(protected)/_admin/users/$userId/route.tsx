import { Outlet, createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import { UserDetailPage, userDetailQueryOptions } from "#/features/users";
import { RouteErrorState, RoutePendingState } from "#/shared/components/route-state";
import { parseNumericId } from "#/shared/lib/route-params";

export const Route = createFileRoute("/(protected)/_admin/users/$userId")({
  loader: ({ context, params }) => context.queryClient.ensureQueryData(userDetailQueryOptions(parseNumericId(params.userId, "user id"))),
  pendingComponent: () => <RoutePendingState label="Loading user…" />,
  errorComponent: ({ error, reset }) => <RouteErrorState error={error} reset={reset} />,
  component: UserLayoutRoute,
});

function UserLayoutRoute() {
  const { userId } = Route.useParams();
  const { data } = useSuspenseQuery(userDetailQueryOptions(parseNumericId(userId, "user id")));
  return <UserDetailPage user={data}><Outlet /></UserDetailPage>;
}
