import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

import { AdminLayout } from "#/app/shell/admin-layout";

export const Route = createFileRoute("/(protected)/_admin")({
  beforeLoad: ({ context }) => {
    if (!context.auth.isSignedIn) {
      throw redirect({ to: "/" });
    }
  },
  component: AdminRoute,
});

function AdminRoute() {
  return <AdminLayout><Outlet /></AdminLayout>;
}
