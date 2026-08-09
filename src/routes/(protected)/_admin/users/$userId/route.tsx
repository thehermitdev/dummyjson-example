import { useSuspenseQuery } from "@tanstack/react-query";
import { Outlet, createFileRoute } from "@tanstack/react-router";

import { UserDetailPage, userDetailQueryOptions } from "#/features/users";
import { DetailPageSkeleton } from "#/shared/components/api-skeletons";
import { RouteErrorState } from "#/shared/components/route-state";
import { parseNumericId } from "#/shared/lib/route-params";

export const Route = createFileRoute("/(protected)/_admin/users/$userId")({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(
      userDetailQueryOptions(parseNumericId(params.userId, "user id")),
    ),
  pendingComponent: DetailPageSkeleton,
  errorComponent: ({ error, reset }) => <RouteErrorState error={error} reset={reset} />,
  component: UserLayoutRoute,
});

function UserLayoutRoute() {
  const { userId } = Route.useParams();
  const { data } = useSuspenseQuery(userDetailQueryOptions(parseNumericId(userId, "user id")));
  return (
    <UserDetailPage user={data}>
      <Outlet />
    </UserDetailPage>
  );
}
