import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import type { PostsListInput } from "#/features/posts";
import { PostsPage, postTagListQueryOptions, postsListQueryOptions } from "#/features/posts";
import { usersDirectoryQueryOptions } from "#/features/users";
import { RouteErrorState, RoutePendingState } from "#/shared/components/route-state";

const searchSchema = z.object({
  page: z.coerce.number().int().min(1).catch(1),
  pageSize: z.coerce.number().int().min(5).max(30).catch(10),
  q: z.string().trim().max(120).optional().catch(undefined),
  tag: z.string().trim().max(80).optional().catch(undefined),
  userId: z.coerce.number().int().positive().optional().catch(undefined),
  sortBy: z.enum(["title", "views", "userId"]).optional().catch(undefined),
  order: z.enum(["asc", "desc"]).catch("asc"),
});

export const Route = createFileRoute("/(protected)/_admin/posts/")({
  validateSearch: (search) => searchSchema.parse(search),
  loaderDeps: ({ search }) => search,
  loader: ({ context, deps }) =>
    Promise.all([
      context.queryClient.ensureQueryData(postsListQueryOptions(deps)),
      context.queryClient.ensureQueryData(postTagListQueryOptions()),
      context.queryClient.ensureQueryData(usersDirectoryQueryOptions()),
    ]),
  pendingComponent: () => <RoutePendingState label="Loading posts…" />,
  errorComponent: ({ error, reset }) => <RouteErrorState error={error} reset={reset} />,
  head: () => ({ meta: [{ title: "Posts · DummyJSON Admin" }] }),
  component: PostsRoute,
});

function PostsRoute() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const posts = useSuspenseQuery(postsListQueryOptions(search)).data;
  const tags = useSuspenseQuery(postTagListQueryOptions()).data;
  const users = useSuspenseQuery(usersDirectoryQueryOptions()).data.users;
  const onInputChange = (next: Partial<PostsListInput>) =>
    void navigate({
      search: (previous) => ({
        ...previous,
        ...(next.page !== undefined ? { page: next.page } : {}),
        ...(next.pageSize !== undefined ? { pageSize: next.pageSize } : {}),
        ...("q" in next ? { q: next.q } : {}),
        ...("tag" in next ? { tag: next.tag } : {}),
        ...("userId" in next ? { userId: next.userId } : {}),
        ...("sortBy" in next ? { sortBy: next.sortBy } : {}),
        ...(next.order !== undefined ? { order: next.order } : {}),
      }),
    });
  return (
    <PostsPage
      data={posts}
      input={search}
      tags={tags}
      users={users}
      onInputChange={onInputChange}
    />
  );
}
