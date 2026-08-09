import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { CartDetailPage, cartDetailQueryOptions } from "#/features/carts";
import { usersDirectoryQueryOptions } from "#/features/users";
import { RouteErrorState, RoutePendingState } from "#/shared/components/route-state";
import { parseNumericId } from "#/shared/lib/route-params";

export const Route = createFileRoute("/(protected)/_admin/carts/$cartId")({
  loader: ({ context, params }) => {
    const cartId = parseNumericId(params.cartId, "cart id");
    return Promise.all([
      context.queryClient.ensureQueryData(cartDetailQueryOptions(cartId)),
      context.queryClient.ensureQueryData(usersDirectoryQueryOptions()),
    ]);
  },
  pendingComponent: () => <RoutePendingState label="Loading cart…" />,
  errorComponent: ({ error, reset }) => <RouteErrorState error={error} reset={reset} />,
  component: CartRoute,
});
function CartRoute() {
  const { cartId: value } = Route.useParams();
  const cartId = parseNumericId(value, "cart id");
  const cart = useSuspenseQuery(cartDetailQueryOptions(cartId)).data;
  const users = useSuspenseQuery(usersDirectoryQueryOptions()).data.users;
  const owner = users.find((user) => user.id === cart.userId);
  return (
    <CartDetailPage
      cart={cart}
      owner={owner ? `${owner.firstName} ${owner.lastName}` : `User #${cart.userId}`}
    />
  );
}
