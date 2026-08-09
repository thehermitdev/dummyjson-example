import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { PostDetailPage, postCommentsQueryOptions, postDetailQueryOptions } from "#/features/posts";
import { usersDirectoryQueryOptions } from "#/features/users";
import { PostDetailSkeleton } from "#/shared/components/api-skeletons";
import { RouteErrorState } from "#/shared/components/route-state";
import { parseNumericId } from "#/shared/lib/route-params";

export const Route = createFileRoute("/(protected)/_admin/posts/$postId")({
  loader: ({ context, params }) => {
    const postId = parseNumericId(params.postId, "post id");
    return Promise.all([
      context.queryClient.ensureQueryData(postDetailQueryOptions(postId)),
      context.queryClient.ensureQueryData(postCommentsQueryOptions(postId)),
      context.queryClient.ensureQueryData(usersDirectoryQueryOptions()),
    ]);
  },
  pendingComponent: PostDetailSkeleton,
  errorComponent: ({ error, reset }) => <RouteErrorState error={error} reset={reset} />,
  component: PostRoute,
});

function PostRoute() {
  const { postId: value } = Route.useParams();
  const postId = parseNumericId(value, "post id");
  const post = useSuspenseQuery(postDetailQueryOptions(postId)).data;
  const comments = useSuspenseQuery(postCommentsQueryOptions(postId)).data;
  const users = useSuspenseQuery(usersDirectoryQueryOptions()).data.users;
  const author = users.find((user) => user.id === post.userId);
  return (
    <PostDetailPage
      post={post}
      comments={comments}
      author={author ? `${author.firstName} ${author.lastName}` : `User #${post.userId}`}
    />
  );
}
