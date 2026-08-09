import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { UserCartsPanel, userCartsQueryOptions } from "#/features/users";
import { RouteErrorState, RoutePendingState } from "#/shared/components/route-state";
import { parseNumericId } from "#/shared/lib/route-params";

export const Route = createFileRoute("/(protected)/_admin/users/$userId/carts")({
  loader: ({ context, params }) => context.queryClient.ensureQueryData(userCartsQueryOptions(parseNumericId(params.userId, "user id"))),
  pendingComponent: () => <RoutePendingState label="Loading user carts…" />,
  errorComponent: ({ error, reset }) => <RouteErrorState error={error} reset={reset} />,
  component: UserCartsRoute,
});
function UserCartsRoute() { const { userId } = Route.useParams(); const { data } = useSuspenseQuery(userCartsQueryOptions(parseNumericId(userId, "user id"))); return <UserCartsPanel data={data} />; }
