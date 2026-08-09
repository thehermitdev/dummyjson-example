import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { PostTagsPage, postTagListQueryOptions, postTagsQueryOptions } from "#/features/posts";
import { RouteErrorState, RoutePendingState } from "#/shared/components/route-state";

export const Route = createFileRoute("/(protected)/_admin/posts/tags")({
  loader: ({ context }) => Promise.all([context.queryClient.ensureQueryData(postTagsQueryOptions()), context.queryClient.ensureQueryData(postTagListQueryOptions())]),
  pendingComponent: () => <RoutePendingState label="Loading tags…" />,
  errorComponent: ({ error, reset }) => <RouteErrorState error={error} reset={reset} />,
  head: () => ({ meta: [{ title: "Post Tags · DummyJSON Admin" }] }),
  component: TagsRoute,
});
function TagsRoute() { const tags = useSuspenseQuery(postTagsQueryOptions()).data; const tagList = useSuspenseQuery(postTagListQueryOptions()).data; return <PostTagsPage tags={tags} tagList={tagList} />; }
