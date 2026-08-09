import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/_admin/users/$userId/")({
  component: UserOverviewRoute,
});

function UserOverviewRoute() {
  return <section className="rounded-xl border bg-card p-5 shadow-xs"><h2 className="font-semibold">Overview</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Use the relationship tabs above to inspect posts authored by this user, carts owned by this user, and tasks assigned to this user. These screens call the dedicated /users/:id relationship endpoints.</p></section>;
}
