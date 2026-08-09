import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { UserPostsPanel, userPostsQueryOptions } from "#/features/users";
import { RouteErrorState, RoutePendingState } from "#/shared/components/route-state";
import { parseNumericId } from "#/shared/lib/route-params";

export const Route = createFileRoute("/(protected)/_admin/users/$userId/posts")({
  loader: ({ context, params }) => context.queryClient.ensureQueryData(userPostsQueryOptions(parseNumericId(params.userId, "user id"))),
  pendingComponent: () => <RoutePendingState label="Loading user posts…" />,
  errorComponent: ({ error, reset }) => <RouteErrorState error={error} reset={reset} />,
  component: UserPostsRoute,
});
function UserPostsRoute() { const { userId } = Route.useParams(); const { data } = useSuspenseQuery(userPostsQueryOptions(parseNumericId(userId, "user id"))); return <UserPostsPanel data={data} />; }
